import { ResponsivePie } from '@nivo/pie'
import { Flex } from "@chakra-ui/react"
import { useDashboardStore } from '../../stores/dashboard'



const MyPie = () => {

  const { details } = useDashboardStore();

  const pieCharts = details?.userTypesPieChart;

  const data = [
    {
      "id": "COMPANIES",
      "label": "Companies",
      "value": pieCharts?.COMPANIES || 0,
      "color": "var(--primary-color)"
    },
    {
      "id": "INDIVIDUALS",
      "label": "Individuals",
      "value": pieCharts?.INDIVIDUALS || 0,
      "color": "var(--support-color)"
    },
    {
      "id": "EMPLOYEES",
      "label": "Employees",
      "value": pieCharts?.EMPLOYEES || 0,
      "color": "var(--secondary-color)"
    },
        {
      "id": "SUPER_ADMIN",
      "label": "Super Admin",
      "value": pieCharts?.SUPER_ADMINS || 0,
      "color": "gray"
    },
  ]

  return (
    <Flex w={"100%"} h={"100%"} bg={"white"}  borderRadius={10} boxShadow={"md"}  >
      <ResponsivePie
        data={data}
        colors={{ datum: 'data.color' }}
        margin={{ top: 40, right: 100, bottom: 80, left: 100 }}
        innerRadius={0.5}
        padAngle={0.6}
        cornerRadius={2}
        activeOuterRadiusOffset={8}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 10]] }}
        legends={[
          {
            anchor: 'bottom-left',
            direction: 'column',
            translateY: 56,
            itemWidth: 100,
            itemHeight: 18,
            symbolShape: 'circle'
          }
        ]}
      />
    </Flex>
  )
}

export default MyPie;
