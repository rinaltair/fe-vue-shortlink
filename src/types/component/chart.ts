import type { EChartsOption } from 'echarts'

// Legend position type
export type LegendPosition = 'bottom' | 'top' | 'left' | 'right'

export type SymbolType =
  | 'circle'
  | 'rect'
  | 'roundRect'
  | 'triangle'
  | 'diamond'
  | 'pin'
  | 'arrow'
  | 'none'

// Chart theme configuration
export interface ChartThemeConfig {
  /** Chart height */
  chartHeight: string
  /** Font size */
  fontSize: number
  /** Font color */
  fontColor: string
  /** Theme color */
  themeColor: string
  /** Color palette */
  colors: string[]
}

// Chart initialization options
export interface UseChartOptions {
  /** Init options */
  initOptions?: EChartsOption
  /** Init delay (ms) */
  initDelay?: number
  /** IntersectionObserver threshold */
  threshold?: number
  /** Auto-respond to theme changes */
  autoTheme?: boolean
}

// Base chart props - shared across charts
export interface BaseChartProps {
  /** Chart height */
  height?: string
  /** Loading state */
  loading?: boolean
  isEmpty?: boolean
  /** Color config */
  colors?: string[]
}

// Axis display control - unified axis config
export interface AxisDisplayProps {
  /** Show axis labels */
  showAxisLabel?: boolean
  /** Show axis line */
  showAxisLine?: boolean
  /** Show split line */
  showSplitLine?: boolean
}

// Interaction display control - unified interaction config
export interface InteractionProps {
  /** Show tooltip */
  showTooltip?: boolean
  /** Show legend */
  showLegend?: boolean
  /** Legend position */
  legendPosition?: LegendPosition
}

// Bar chart data item
export interface BarDataItem {
  /** Series name */
  name: string
  /** Data values */
  data: number[]
  /** Bar width */
  barWidth?: string | number
  /** Stack group name */
  stack?: string
}

// Bar chart props - unified config
export interface BarChartProps extends BaseChartProps, AxisDisplayProps, InteractionProps {
  /** Chart data - single or multiple series */
  data: number[] | BarDataItem[]
  /** X-axis labels */
  xAxisData?: string[]
  /** Bar width */
  barWidth?: string | number
  /** Whether to stack */
  stack?: boolean
  /** Border radius */
  borderRadius?: number | number[]
}

// Line chart data item
export interface LineDataItem {
  /** Series name */
  name: string
  /** Data values */
  data: number[]
  /** Line width */
  lineWidth?: number
  /** Whether to show area fill */
  showAreaColor?: boolean
  /** Area style config */
  areaStyle?: {
    /** Gradient start opacity */
    startOpacity?: number
    /** Gradient end opacity */
    endOpacity?: number
    /** Custom ECharts areaStyle config */
    custom?: any
  }
  /** Whether to smooth the line */
  smooth?: boolean
  /** Data point symbol */
  symbol?: SymbolType
  /** Data point size */
  symbolSize?: number
}

// Line chart props - unified config
export interface LineChartProps extends BaseChartProps, AxisDisplayProps, InteractionProps {
  /** Chart data - single or multiple series */
  data: number[] | LineDataItem[]
  /** X-axis labels */
  xAxisData?: string[]
  /** Line width */
  lineWidth?: number
  /** Whether to show area fill */
  showAreaColor?: boolean
  /** Whether to smooth the line */
  smooth?: boolean
  /** Data point symbol */
  symbol?: SymbolType
  /** Data point size */
  symbolSize?: number
  /** Multi-series animation delay (ms) */
  animationDelay?: number
}

// Radar chart data item
export interface RadarDataItem {
  /** Series name */
  name: string
  /** Data values */
  value: number[]
}

// Radar chart props - unified config
export interface RadarChartProps extends BaseChartProps, InteractionProps {
  /** Radar indicators */
  indicator?: Array<{ name: string; max: number }>
  /** Chart data */
  data?: RadarDataItem[]
}

// Pie/donut chart data item
export interface PieDataItem {
  /** Data value */
  value: number
  /** Data name */
  name: string
}

// Donut chart props - unified config
export interface RingChartProps extends BaseChartProps, InteractionProps {
  /** Chart data */
  data: PieDataItem[]
  /** Inner and outer radius */
  radius?: string[]
  /** Border radius */
  borderRadius?: number
  /** Center text */
  centerText?: string
  /** Whether to show labels */
  showLabel?: boolean
}

// K-line (candlestick) data item
export interface KLineDataItem {
  /** Time label */
  time: string
  /** Open price */
  open: number
  /** Close price */
  close: number
  /** High price */
  high: number
  /** Low price */
  low: number
}

// K-line chart props - unified config
export interface KLineChartProps extends BaseChartProps {
  /** Chart data */
  data?: KLineDataItem[]
  /** Show data zoom controls */
  showDataZoom?: boolean
  /** Data zoom start */
  dataZoomStart?: number
  /** Data zoom end */
  dataZoomEnd?: number
}

// Scatter chart data item
export interface ScatterDataItem {
  /** Coordinate [x, y] */
  value: number[]
}

// Scatter chart props - unified config
export interface ScatterChartProps extends BaseChartProps, AxisDisplayProps, InteractionProps {
  /** Chart data */
  data?: ScatterDataItem[]
  /** Scatter size */
  symbolSize?: number
}

// Dual-bar comparison chart props - unified config
export interface DualBarCompareChartProps extends BaseChartProps {
  /** Top data */
  topData: number[]
  /** Bottom data */
  bottomData: number[]
  /** X-axis labels */
  xAxisData: string[]
  /** Top bar color */
  topColor?: string
  /** Bottom bar color */
  bottomColor?: string
  /** Bar width */
  barWidth?: number
}

// Map chart props - unified config
export interface MapChartProps extends BaseChartProps {
  /** Map data */
  mapData?: any[]
  /** Selected region */
  selectedRegion?: string
  /** Show labels */
  showLabels?: boolean
  /** Show scatter */
  showScatter?: boolean
}

// Bidirectional stacked bar chart props (population pyramid style)
export interface BidirectionalBarChartProps
  extends BaseChartProps,
    AxisDisplayProps,
    InteractionProps {
  /** Positive values (displayed upwards) */
  positiveData: number[]
  /** Negative values (displayed downwards) */
  negativeData: number[]
  /** X-axis labels */
  xAxisData?: string[]
  /** Positive data name */
  positiveName?: string
  /** Negative data name */
  negativeName?: string
  /** Bar width */
  barWidth?: string | number
  /** Y-axis min */
  yAxisMin?: number
  /** Y-axis max */
  yAxisMax?: number
  /** Show data labels */
  showDataLabel?: boolean
  /** Positive data border radius */
  positiveBorderRadius?: number | number[]
  /** Negative data border radius */
  negativeBorderRadius?: number | number[]
}

// Chart option generator type
export type ChartOptionGenerator = () => EChartsOption

// Chart event callback type
export type ChartEventCallback = (params: any) => void

// Chart error info interface
export interface ChartError {
  /** Error code */
  code: string
  /** Error message */
  message: string
  /** Error details */
  details?: any
}
