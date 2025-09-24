import { Flex, Grid, GridItem } from "@chakra-ui/react";
import ProfileCard from "../components/Dashboard/profileCard";
import ActiveServices from "../components/Dashboard/activeServices";
import RecentInvoices from "../components/Dashboard/recentInvoices";
import ExpireSoonServices from "../components/Dashboard/ExpireSoon";
import UpcomingServices from "../components/Dashboard/upcomingServices";
import AdvanceCard from "../components/Dashboard/advanceCard";
import WalletCard from "../components/Dashboard/walletCard";
import { useDashboardStore } from "../stores/dashboard";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "../stores/auth";
import HolidayList from "../components/Dashboard/HolidayList";
import ReferAndEarn from "../components/Dashboard/ReferAndEarn";
import companiesVsRenewals from "../components/Dashboard/companiesVsRenewalsPieChart";
import SecurityDepositsCard from "../components/Dashboard/securityDepositsHeld";
import TotalActiveUsersCard from "../components/Dashboard/totalActiveUsers";
import TotalRevenueCollectedCard from "../components/Dashboard/totalRevenueCollected";
import UpcomingRenewalsCard from "../components/Dashboard/upcomingRenewals";
import MyPie from "../components/Dashboard/companiesVsRenewalsPieChart";
import MyLine from "../components/Dashboard/revenueTrendLineChart";
import Users from "./users";
const Dashboard = () => {
  const { role } = useAuthStore();
  const { fetchDashboardDetails, fetchAdminDashboardDetails } = useDashboardStore();
  const firstGridItemRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    role !== "SUPER_ADMIN" && fetchDashboardDetails();
    role === "SUPER_ADMIN" && fetchAdminDashboardDetails();
  }, []);

  useEffect(() => {
    if (!firstGridItemRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          setHeight(entry.contentRect.height);
        }
      }
    });

    observer.observe(firstGridItemRef.current);
    // Cleanup
    return () => observer.disconnect();
  }, []);


  if (role !== "SUPER_ADMIN")
    return (
      <Grid
        templateColumns={{ base: "repeat(6, 1fr)" }}
        templateRows={{ base: "repeat(1,1fr)", md: "repeat(5, 1fr)" }}
        gridAutoRows={"min-content"}
        gap={2}
      >
        <GridItem h={"100%"} rowSpan={1} colSpan={{ base: 6 }}>
          <Grid
            h={"100%"}
            flexGrow={1}
            templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(6, 1fr)" }}
            templateRows="repeat(1,1fr)"
            gap={2}
          >
            <GridItem
              flexGrow={1}
              position={"relative"}
              containerType={"inline-size"}
              colSpan={{ base: 1, md: 2 }}
            >
              <ProfileCard />
            </GridItem>
            <GridItem
              position={"relative"}
              containerType={"inline-size"}
              colSpan={{ base: 1, md: 2 }}
            >
              <AdvanceCard />
            </GridItem>

            <GridItem
              position={"relative"}
              containerType={"inline-size"}
              colSpan={{ base: 1, md: 2 }}
            >
              <WalletCard />
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem h={"100%"}
          rowSpan={4} colSpan={{ base: 6, md: 4 }} ref={firstGridItemRef}>
          <Grid
            h={"100%"}
            templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
            templateRows="repeat(2, 1fr)"
            gap={2}
          >
            <GridItem
              h={"100%"}
              containerType={"inline-size"}
              colSpan={{ base: 1, md: 2 }}
            > <ActiveServices />

              {/* <UpcomingServices /> */}
            </GridItem>
            <GridItem
              containerType={"inline-size"}
              colSpan={{ base: 1, md: 2 }}
            >
              <ReferAndEarn />
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem h={{ base: "100%", md: height }} rowSpan={4} colSpan={{ base: 6, md: 2 }}>
          <Grid
            h={"100%"}
            templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
            templateRows="repeat(2, 1fr)"
            gap={2}
          >
            <GridItem
              containerType={"inline-size"}
              colSpan={{ base: 1, md: 2 }} rowSpan={4}
            >
              <HolidayList />
            </GridItem>
            {/* <GridItem
                containerType={"inline-size"}
                colSpan={{ base: 1, md: 2 }}
              >
                <RecentInvoices />
              </GridItem> */}
          </Grid>
        </GridItem>
      </Grid>
    );


  if (role === "SUPER_ADMIN")
    return (
      <Flex gap={2} direction={"column"}>
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(4,1fr)" }}
          templateRows={{ base: "repeat(1,1fr)", md: "repeat(1, 1fr)" }}
          gap={{ base: 2 }}
        >
          <GridItem containerType={"inline-size"} rowSpan={1} colSpan={{ base: 1 }}>
            <TotalActiveUsersCard />
          </GridItem>
          <GridItem containerType={"inline-size"} rowSpan={1} colSpan={{ base: 1 }}>
            <TotalRevenueCollectedCard />
          </GridItem>
          <GridItem containerType={"inline-size"} rowSpan={1} colSpan={{ base: 1 }}>
            <SecurityDepositsCard />
          </GridItem>
          <GridItem containerType={"inline-size"} rowSpan={1} colSpan={{ base: 1 }}>
            <UpcomingRenewalsCard />
          </GridItem>
        </Grid>
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(5,1fr)" }}
          templateRows={{ base: "repeat(1,1fr)" }}
          gap={{ base: 2 }}
        >
          <GridItem minHeight="400px" containerType={"inline-size"} rowSpan={1} colSpan={{ base: 1, lg: 2 }}>
            <MyPie />
          </GridItem>
          <GridItem minHeight="400px" containerType={"inline-size"} rowSpan={1} colSpan={{ base: 1, lg: 3 }}>
            <MyLine />
          </GridItem>
        </Grid>
        <Users />
      </Flex>
    );
};

export default Dashboard;
