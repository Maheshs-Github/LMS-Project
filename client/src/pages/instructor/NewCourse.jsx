import React from 'react'

const NewCourse = () => {
  return (
    <div className='p-6'>
      <h2 className='text-lg font-semibold '>Let's add up the details of new course</h2>
      <div className='flex justify-between'>
        <div>
          <h4 className='font-semibold'>Basic Information </h4>
          <p>Fill up the Info to Launch new Course</p>
        </div>
        <div className='flex gap-6'>
        <button className='p-2 text-gray-700 shadow-md border cursor-pointer bg-white'>Unpublish</button>
        <button className='p-2 bg-black text-white rounded cursor-pointer'>Remove Course</button>
        </div>
      </div>
    </div>
  )
}

export default NewCourse
