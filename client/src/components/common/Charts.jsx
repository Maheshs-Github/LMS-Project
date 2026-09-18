import Chart from "react-apexcharts";

const LineChart = ({
  title,
  categories = [],
  series = [],
  height = 350,
}) => {
  const options = {
    chart: {
      id: title,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
      background: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: "var(--muted-foreground, #888888)",
          fontSize: "12px",
        },
      },
      axisBorder: {
        color: "var(--border, #e5e7eb)",
      },
      axisTicks: {
        color: "var(--border, #e5e7eb)",
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "var(--muted-foreground, #888888)",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      theme: "dark",
    },
    grid: {
      borderColor: "var(--border, #e5e7eb)",
      strokeDashArray: 4,
    },
    theme: {
      mode: "light",
    },
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-foreground">
        {title}
      </h2>

      <div className="min-h-[350px]">
        <Chart
          options={options}
          series={series}
          type="line"
          height={height}
        />
      </div>
    </div>
  );
};

export default LineChart;