import LineChart from '@/components/common/Charts'
import { revenueAnalytics, studentAnalytics } from '@/resources/Data'
import React, { useEffect, useState } from 'react'
import CoursePerformance from './CoursePerformance'
import { useGet } from '@/hooks/useGet'

const InstructorDashboard = () => {
  const {data}=useGet("dashboard/instructor");

  const [totalStudent,setTotalStudent]=useState(0);
  const [totalLecture,setTotalLecture]=useState(0);
  const [totalCourse,setTotalCourse]=useState(0);

  useEffect(()=>{
    console.log("data: ",data);
    const instructorData=data?.data;
    setTotalStudent(instructorData?.studentCount);
    setTotalLecture(instructorData?.lectureCount);
    setTotalCourse(instructorData?.courseCount);

  },[data]);

  const courses = data?.data?.courseData || [];

  useEffect(()=>console.log("data: ",data),[data])
  return (

    <div className="w-full flex flex-col gap-6 p-6">
      <div className="grid lg:grid-cols-5 w-full gap-5">
        <div className="p-5 shadow-md rounded-lg col-span-1 flex flex-col gap-4 ">
          <div className="text-lg">Total Courses</div>
          <div className="font-semibold text-blue-600 text-lg">{totalCourse}</div>
        </div>
        <div className="p-3 shadow-md rounded-lg col-span-1 flex flex-col gap-4 ">
          <div className="text-lg">Total Students</div>
          <div className="font-semibold text-blue-600 text-lg">{totalStudent}</div>
        </div>
                <div className="p-3 shadow-md rounded-lg col-span-1 flex flex-col gap-4 ">
          <div className="text-lg">Total Lectures</div>
          <div className="font-semibold text-blue-600 text-lg">{totalLecture}</div>
        </div>
                <div className="p-3 shadow-md rounded-lg col-span-1 flex flex-col gap-4 ">
          <div className="text-lg">Course Completion </div>
          <div className="font-semibold text-blue-600 text-lg">312241</div>
        </div>
      </div>
      {/* <div className="grid gap-6 w-full min-w-0 overflow-hidden ">

       <LineChart
        title={studentAnalytics.title}
        categories={studentAnalytics.categories}
        series={studentAnalytics.series}
      />

      <LineChart
        title={revenueAnalytics.title}
        categories={revenueAnalytics.categories}
        series={revenueAnalytics.series}
      /> 

    </div> */}

    <CoursePerformance courses={courses}/>
    </div>


  )
}

export default InstructorDashboard
