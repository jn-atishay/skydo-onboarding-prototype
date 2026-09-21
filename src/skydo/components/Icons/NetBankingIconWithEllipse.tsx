const NetBankingIconWithEllipse = ({ width = "48", height = "48", bgStrokeColor = "#D4E2FC" }: { width?: string, height?: string, bgStrokeColor?: string }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" fill={bgStrokeColor} />
            <path d="M32 29.5547H16.1052C15.5529 29.5547 15.1052 30.0024 15.1052 30.5547V33.0284C15.1052 33.5807 15.5529 34.0284 16.1052 34.0284H32C32.5523 34.0284 33 33.5807 33 33.0284V30.5547C33 30.0024 32.5523 29.5547 32 29.5547Z" stroke="#0A2540" strokeWidth="1.5" />
            <path d="M32 20.344H16.1052C15.5529 20.344 15.1052 19.8963 15.1052 19.344V18.0974C15.1052 17.7031 15.3369 17.3456 15.6969 17.1846L23.5884 13.6542C23.8467 13.5386 24.1419 13.5379 24.4007 13.6522L32.4039 17.1861C32.7662 17.3461 33 17.7048 33 18.1009V19.344C33 19.8963 32.5523 20.344 32 20.344Z" stroke="#0A2540" strokeWidth="1.5" />
            <path d="M17.4751 20.6074V29.818" stroke="#0A2540" strokeWidth="1.5" />
            <path d="M24.0525 20.6074V29.818" stroke="#0A2540" strokeWidth="1.5" />
            <path d="M30.8953 20.6074V29.818" stroke="#0A2540" strokeWidth="1.5" />
        </svg>
    )
}

export default NetBankingIconWithEllipse;