import { createChart, ColorType, IChartApi } from 'lightweight-charts'
import React, { useEffect, useRef, useState } from 'react'
import Timeseries from '../../models/Timeseries'
import { lightModeColor } from './lightModeColor'
import { darkModeColor } from './darkModeColor'
import { useColorMode } from '@chakra-ui/react'

interface ChartComponentProps {
    windowSize: number
    data: Timeseries[]
    colors?: {
        backgroundColor?: string
        lineColor?: string
        textColor?: string
        areaTopColor?: string
        areaBottomColor?: string
    }
}

export const ChartComponent: React.FC<ChartComponentProps> = (props) => {

    const {
        windowSize,
        data,
        colors: {
            backgroundColor = 'white',
            lineColor = '#2962FF',
            textColor = 'black',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
    } = props

    const chartContainerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)

    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                
                chartRef.current.applyOptions({ width: chartContainerRef.current?.clientWidth })
            }
        }

        chartRef.current = createChart(chartContainerRef.current!, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current?.clientWidth || 0,
            height: 300,
        })
        chartRef.current.timeScale().fitContent()

        const newSeries = chartRef.current.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor })
        newSeries.setData(data)

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)

            if (chartRef.current) {
                chartRef.current.remove()
            }
        }
    }, [windowSize, chartContainerRef, data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor])

    return <div ref={chartContainerRef} />
}