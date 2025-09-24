import "croppie/croppie.css";
import React, { useState, useRef, useEffect } from "react";
import Croppie from "croppie";
import { Dialog, Button, Input, Box, Image, Flex, Spinner, Text, ButtonGroup, Container, Center, CloseButton } from "@chakra-ui/react"
import { Tooltip } from "./ui/tooltip";
import uploadIcon from "../assets/upload";
import CloseIcon from "../assets/close";
import Flip from "../assets/flip";
import RotateMinus90 from "../assets/rotate-90";
import RotatePlus90 from "../assets/rotate+90";
import ReplaceImage from "../assets/replaceImage";
import { useSettingsStore } from "../stores/settings";
import { toaster } from "./ui/toaster";

const UploadAndCrop: React.FC = () => {
    const { profileDetails, uploadProfileImage, replaceProfileImage, setEditProfile } = useSettingsStore();
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
    const [croppedImage, setCroppedImage] = useState<string | undefined>(undefined);
    const [croppieInstance, setCroppieInstance] = useState<Croppie | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [orientation, setOrientation] = useState<number>(1);
    const [flip, setFlip] = useState<{ horizontal: boolean; vertical: boolean }>({ horizontal: false, vertical: false });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const croppieRef = useRef<HTMLDivElement>(null);
    const croppieContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (!file) return;

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert("Please select an image file");
            return;
        }

        setIsLoading(true);

        // Clean up previous instance
        if (croppieInstance) {
            croppieInstance.destroy();
            setCroppieInstance(null);
        }

        // Reset flip state
        setFlip({ horizontal: false, vertical: false });

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            if (result) {
                setImageSrc(result);
                setShowModal(true);
            }
            setIsLoading(false);
        };

        reader.onerror = () => {
            alert("Failed to read the image file");
            setIsLoading(false);
        };

        reader.readAsDataURL(file);
    };

    // Setup croppie element
    useEffect(() => {
        if (showModal && imageSrc && !croppieInstance) {
            // Short delay to ensure DOM elements are ready
            const timer = setTimeout(() => {
                initCroppie();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [showModal, imageSrc, croppieInstance]);

    const initCroppie = () => {
        if (!croppieRef.current || !imageSrc) return;

        try {
            // Create new instance
            const croppie = new Croppie(croppieRef.current, {
                viewport: { width: 200, height: 200 }, // Smaller viewport for better mobile view
                boundary: { width: 200, height: 200 },
                enableExif: true,
                enableOrientation: true,
                enableZoom: true,
                enforceBoundary: true,
                mouseWheelZoom: true,
                showZoomer: true,
            });

            croppie.bind({
                url: imageSrc,
                orientation,
            }).then(() => {
                // Apply flip if needed
                applyFlipTransform();
            }).catch(err => {
                console.error("Error binding image:", err);
                alert("Failed to load the image for editing");
            });

            setCroppieInstance(croppie);
        } catch (error) {
            console.error("Error initializing Croppie:", error);
            alert("Failed to initialize the image editor");
        }
    };

    const handleCrop = async () => {
        if (!croppieInstance) return;

        setIsLoading(true);

        try {
            // Get the base result from croppie
            const result = await croppieInstance.result({
                type: "base64",
                size: "viewport",
                format: "jpeg",
                quality: 0.9
            }) as string;

            // Apply flip transformations if needed
            if (flip.horizontal || flip.vertical) {
                const finalImage = await applyFlipToImage(result, flip.horizontal, flip.vertical);
                await sendImageToAPI(finalImage);
                setCroppedImage(finalImage);
            } else {
                // Use original result if no flips
                await sendImageToAPI(result);
                setCroppedImage(result);
            }

            // Close modal and cleanup
            cleanupCroppieInstance();

        } catch (error) {
            console.error("Error cropping image:", error);
            alert("Could not crop the image");
        } finally {
            setIsLoading(false);
        }
    };

    // New function to apply flip transformations to the image data
    const applyFlipToImage = (base64Image: string, flipHorizontal: boolean, flipVertical: boolean): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                // Apply transformations
                ctx.save();
                ctx.translate(flipHorizontal ? canvas.width : 0, flipVertical ? canvas.height : 0);
                ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
                ctx.drawImage(img, 0, 0);
                ctx.restore();

                // Convert back to base64
                resolve(canvas.toDataURL('image/jpeg', 0.9));
            };

            img.onerror = () => reject(new Error('Failed to load image for flip transformation'));
            img.src = base64Image;
        });
    };

    const sendImageToAPI = async (base64Image: string) => {
        let toastId: any = toaster.create({ description: profileDetails?.imageUrl ? "Replacing..." : "Uploading...", type: "loading" })

        try {
            // Create FormData
            const formData = new FormData();
            // Convert base64 to blob
            const response = await fetch(base64Image);
            const blob = await response.blob();
            // Append the image to FormData
            formData.append('file', blob, 'cropped-image.jpg');
            if (profileDetails?.imageUrl) {
                formData.append('url', profileDetails?.imageUrl);
                const response: any = await replaceProfileImage(formData);
                toaster.update(toastId, { description: response.message || "Image Replaced Succesfully", type: "success" })
                setLoading(false);
            } else {
                const response: any = await uploadProfileImage(formData);
                toaster.update(toastId, { description: response.message || "Image Uploaded Succesfully", type: "success" })
                setLoading(false);
            }

        } catch (error: any) {
            toaster.update(toastId, { description: error.message || "Image Uploading Failed", type: "error" });
            setLoading(false); // Keep this here for immediate error handling
            console.error('Error sending image to API:', error);
            // Don't throw here - we want to continue even if API fails
        } finally {
            handleModalClose();
            setEditProfile(false)
        }
    };

    const cleanupCroppieInstance = () => {
        try {
            // Only check if the instance exists
            if (!croppieInstance) {
                return;
            }

            // Safely attempt to destroy
            try {
                if (typeof croppieInstance.destroy === "function") {
                    if ((croppieInstance as any)?.boundary) croppieInstance.destroy();
                }
            } catch (destroyError) {
                // If destroy fails, log it but continue with cleanup
                console.error("Error destroying Croppie instance:", destroyError);
            }

            // Always clear the instance reference, even if destroy fails
            setCroppieInstance(null);
        } catch (error) {
            console.error("Error in cleanup:", error);
            setCroppieInstance(null);
        }
    };
    const handleModalClose = () => {
        // First set showModal to false
        setShowModal(false);

        // Clear the image source
        setImageSrc(undefined);

        // Clean up with a longer delay
        setTimeout(() => {
            cleanupCroppieInstance();

            // Reset file input to allow reselecting the same file
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }, 300);
    };

    const rotateImage = (degree: 90 | -90) => {
        if (croppieInstance) {
            croppieInstance.rotate(degree);
        }
    };

    const flipImage = (direction: "horizontal" | "vertical") => {
        setFlip(prevFlip => ({
            ...prevFlip,
            [direction]: !prevFlip[direction]
        }));
    };

    // Apply flip transformations
    const applyFlipTransform = () => {
        if (!croppieInstance || !croppieRef.current) return;

        const container = croppieRef.current.querySelector(".cr-boundary") as HTMLElement;
        if (container) {
            container.style.transform = `
        scaleX(${flip.horizontal ? -1 : 1})
        scaleY(${flip.vertical ? -1 : 1})
      `;
        }
    };

    useEffect(() => {
        applyFlipTransform();
    }, [flip]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (croppieInstance) {
                croppieInstance.destroy();
            }
        };
    }, [croppieInstance]);

    const handleButtonClick = () => {
        fileInputRef.current?.click(); // Triggers the hidden file input
    };

    return (
        <Flex direction="column" align="center" justify="center">
            <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                p={1}
                h="auto"
                display="none" // Hide the input
            />
            {
                !profileDetails?.imageUrl && <Tooltip content="upload Image">
                    <Box _hover={{ cursor: "pointer" }} onClick={handleButtonClick} borderRadius={5} p={1} bg={"var(--chakra-colors-green-600)"} >{uploadIcon("1.2em", "1.2em", "var(--chakra-colors-white-alpha-800)")}</Box>
                </Tooltip>
            }

            {
                profileDetails?.imageUrl && <Tooltip content="Change Image">
                    <Box _hover={{ cursor: "pointer" }} onClick={handleButtonClick} borderRadius={5} p={1} bg={"blackAlpha.800"} >{ReplaceImage("1.2em", "1.2em", "var(--chakra-colors-white-alpha-800)")}</Box>
                </Tooltip>
            }

            <Dialog.Root size={"xs"}
                open={showModal}
                onOpenChange={(open) => {
                    if (!open) handleModalClose();
                }}
            >
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content >
                        <Flex p={3} justifyContent={"space-between"} >
                            <Dialog.Title>Crop Image</Dialog.Title>
                            <Button p={0} variant={"outline"} onClick={(e) => {
                                e.preventDefault();
                                handleModalClose();
                            }}>{CloseIcon()}</Button>
                        </Flex>
                        <Dialog.Body justifyContent={"center"} p={0}>
                            {isLoading ? (
                                <Center h="300px"><Spinner size="md" /></Center>
                            ) : (
                                <Center
                                    borderTop={"1px solid var(--chakra-colors-gray-200)"}
                                    borderBottom={"1px solid var(--chakra-colors-gray-200)"}
                                    pt={5}
                                    bg={"gray.100"}
                                    ref={croppieContainerRef}
                                    w="100%"
                                    h="100%"
                                    overflow="hidden"
                                    margin="0 auto"  // Add this to center horizontally
                                    display="flex"   // Ensure flex display
                                    justifyContent="center"  // Center content horizontally
                                    alignItems="center"      // Center content vertically
                                >
                                    {/* This div will be transformed by Croppie */}
                                    <div
                                        ref={croppieRef}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: "column",
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    />
                                </Center>
                            )}
                        </Dialog.Body>

                        <Dialog.Footer >
                            <Flex w={"100%"} justifyContent={"space-around"} alignItems={"center"}>
                                <Button p={0} onClick={() => rotateImage(90)} bg={"gray"}>
                                    {RotateMinus90()}
                                </Button>
                                <Button p={0} onClick={() => rotateImage(-90)} bg={"gray"}>
                                    {RotatePlus90()}
                                </Button>
                                <Button p={0}
                                    onClick={() => flipImage("horizontal")}
                                    bg={"gray"}
                                    variant={flip.horizontal ? "solid" : "outline"}
                                >
                                    {Flip()}
                                </Button>
                                <Button p={0} rotate="90"
                                    onClick={() => flipImage("vertical")}
                                    bg={"gray"}
                                >
                                    {Flip()}
                                </Button>
                                <Button w={90} bg={"var(--chakra-colors-green-600)"}
                                    onClick={handleCrop}
                                    loadingText="Cropping"
                                >
                                    {loading ? <Spinner /> : "Upload"}
                                </Button>
                            </Flex>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </Flex >
    );
};

export default UploadAndCrop;