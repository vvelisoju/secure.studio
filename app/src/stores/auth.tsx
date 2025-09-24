import { create } from 'zustand';
import { sendOTP, verifyOTP, tokenRefresh, reSendOTP } from '../api/auth';
import { persist, createJSONStorage } from 'zustand/middleware';


type Role = "SUPER_ADMIN" | "USER_ADMIN" | "USER" | "EMPLOYEE"

interface AuthState {
  sendOtpDetails: any,
  user: any,
  role: Role,
  email: string,
  view: string,
  currentStep: string,
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  otpToken: string | null;
  afterLoginGoTo: string,
  openSideBar: boolean,
  setOpenSideBar: (value: boolean) => void;
  setCurrentStep: (value: string) => void;
  setView: (value: string) => void;
  setAfterLoginGotTo: (value: string) => void,
  setOtpToken: (value: string | null) => void;
  sendOTP: (credentials: any) => Promise<void>;
  resendOTP: () => Promise<void>;
  verifyOTP: (otpData: any) => Promise<void>; tokenRefresh: () => Promise<void>;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (data: any) => void;
}

// Constants for error messages
const ERROR_MESSAGES = {
  OTP_TOKEN_MISSING: 'OTP token missing',
  USER_EMAIL_MISSING: 'User email is missing',
  NO_REFRESH_TOKEN: 'No refresh token available',
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      sendOtpDetails: {},
      user: {},
      role: "USER",
      email: "",
      view: "login",
      currentStep: "login",
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      otpToken: null,
      afterLoginGoTo: "/dashboard",
      openSideBar: false,
      setOpenSideBar: (value) => set({ openSideBar: value }),
      setCurrentStep: (value) => set({ currentStep: value }),
      setView: (value) => set({ view: value }),
      setAfterLoginGotTo: (value) => { set({ afterLoginGoTo: value }) },
      setOtpToken: (value) => { set({ otpToken: value }) },
      sendOTP: async (credentials) => {
        try {
          set({ email: credentials.email, sendOtpDetails: credentials });
          const data = await sendOTP(credentials);
          return data.data;
        } catch (error) {
          throw error;
        }
      },
      resendOTP: async () => {
        try {
          const { email, otpToken, sendOtpDetails } = get();
          if (!otpToken) throw new Error(ERROR_MESSAGES.OTP_TOKEN_MISSING);
          if (!email) throw new Error(ERROR_MESSAGES.USER_EMAIL_MISSING);
          const response = await reSendOTP({
            name: sendOtpDetails.name,
            email: sendOtpDetails.email,
            type: sendOtpDetails.type,
            otpToken,
          });
          const { accessToken, refreshToken, user: userDetails } = response.data;
          const user = userDetails
          if (accessToken) {
            set({ isAuthenticated: true, accessToken, refreshToken, user, view: "login" });
          }
          return response.data;
        } catch (error) {
          throw error;
        }
      },
      // Verify OTP and set access/refresh tokens
      verifyOTP: async (otpData) => {
        try {
          const { otpToken, sendOtpDetails } = get();
          if (!otpToken) throw new Error(ERROR_MESSAGES.OTP_TOKEN_MISSING);
          const response = await verifyOTP({
            ...sendOtpDetails,
            otp: otpData.otp,
            otpToken,
            referralCode: otpData.referralCode
          });

          const { accessToken, refreshToken, user: userDetails } = response.data;
          const user = userDetails

          if (accessToken) {
            set({ isAuthenticated: true, accessToken, refreshToken, user, role: user?.userType, sendOtpDetails: {} });
          }

          return response.data;
        } catch (error) {
          throw error;
        }
      },
      tokenRefresh: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          console.error(ERROR_MESSAGES.NO_REFRESH_TOKEN);
          get().logout();
          return;
        }

        try {
          const response = await tokenRefresh({ token: refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          if (accessToken) {
            set({ isAuthenticated: true, accessToken, refreshToken: newRefreshToken });
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().logout();
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null, afterLoginGoTo: "/dashboard" });
        localStorage.removeItem("auth-store");
      },
      setTokens: (accessToken, refreshToken) => { set({ accessToken, refreshToken }) },
      setUser: (data) => set({ user: data }),
    }),
    {
      name: 'auth-store', // Key for localStorage
      storage: createJSONStorage(() => localStorage), // Use JSON serialization with localStorage
      partialize: (state) => (state.isAuthenticated ? state : {}),
    }
  )
);

export default useAuthStore;