import { ResponsiveLine } from '@nivo/line'
import { Flex } from "@chakra-ui/react"
import { useDashboardStore } from '../../stores/dashboard';


const MyLine = () => {


    const { details } = useDashboardStore();

    const revenueAreaLineChart = details?.revenueAreaLineChart;

    const data = [
        {
            id: "Revenue",
            data: revenueAreaLineChart || []
        }
    ]

    return (
        <Flex w={"100%"} h={"100%"} bg={"white"} borderRadius={10} boxShadow={"md"}  >
            <ResponsiveLine /* or Line for fixed dimensions */
                data={data}
                margin={{ top: 50, right: 30, bottom: 70, left: 70 }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                yFormat={value => `${value}`}
                axisBottom={{ legend: 'Revenue This Year', legendOffset: 56 }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'seriesColor' }}
                pointLabelYOffset={-12}
                enableTouchCrosshair={true}
                useMesh={true}
                curve='cardinal'
                enableArea={true}
                colors={{ scheme: 'category10' }}
                defs={[
                    {
                        id: 'gradientA',
                        type: 'linearGradient',
                        colors: [
                            { offset: 0, color: '#048DE3', opacity: 1 },
                            { offset: 100, color: '#ffffff', opacity: 0.5 }
                        ],
                    },
                ]}
                fill={[
                    {
                        match: '*',
                        id: 'gradientA',
                    },
                ]}
            />
        </Flex>

    )
}

export default MyLine;