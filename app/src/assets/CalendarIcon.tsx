const CalendarIcon = (h?: string, w?: string, color?: string) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={h || "48px"} viewBox="0 0 24 24" width={w || "48px"} fill={color || "#1f1f1f"}>
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2zm0 16H5V10h14v10zm-7-9h5v5h-5v-5zm-2 0H5v5h5v-5z" />
        </svg>
    );
};

export default CalendarIcon;
