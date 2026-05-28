// components/charts/LineChart.jsx

import Chart from "react-apexcharts";

const LineChart = ({
  title,
  categories,
  series,
  height = 350,
  
}) => {

  const options = {
    chart: {
      id: title,
      toolbar: {
        show: false,
      },
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
    },

    tooltip: {
      theme: "dark",
    },

    grid: {
      borderColor: "#e5e7eb",
    },
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow">

      <h2 className="text-xl font-semibold mb-4">
        {title}
      </h2>

      <Chart
        options={options}
        series={series}
        type="line"
        height={height}
      />

    </div>
  );
};

export default LineChart;