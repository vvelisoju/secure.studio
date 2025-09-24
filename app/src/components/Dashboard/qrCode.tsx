import { Flex } from "@chakra-ui/react";
import { QrCode } from "@chakra-ui/react";
const QrCodeCard = () => {
    return (
        <Flex alignItems={"center"} justifyContent={"center"} >
            <QrCode.Root color={"secondary"} value={"https://dev.secure.studio/"}  >
                <QrCode.Frame h={"25cqw"} w={"25cqw"}   >
                    <QrCode.Pattern />
                </QrCode.Frame>
            </QrCode.Root>
        </Flex>
    )
}

export default QrCodeCard

