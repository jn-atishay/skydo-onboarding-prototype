import React from "react";

const getEmailPreviewLoader = () => (
  <div className={"flex flex-col h-[560px] bg-white p-4 rounded-b-10px"}>
    <div className={"flex flex-col p-4"}>
      <div className={"flex flex-col mb-6 h-16 w-16 bg-black-100 rounded-10px"} />
      <div className={"flex flex-col my-6 h-8 bg-black-100 rounded-10px"} />
      <div className={"flex flex-col my-1 h-2 bg-black-100 rounded-10px"} />
      <div className={"flex flex-col my-1 h-2 bg-black-100 rounded-10px"} />
      <div className={"flex flex-col mt-6 my-4 h-10 bg-black-100 rounded-10px max-w-[150px]"} />
      <hr className={"border-black-400 my-4"} />
      <div className={"flex flex-col mt-6 mb-1 h-2 bg-black-100 rounded-10px"} />
      <div className={"flex flex-col my-1 h-2 bg-black-100 rounded-10px"} />
      <div className={"flex flex-col my-1 h-2 bg-black-100 rounded-10px"} />
      <div className={"flex flex-col my-1 h-2 bg-black-100 rounded-10px"} />
      <div className={"flex flex-col my-1 h-2 bg-black-100 rounded-10px"} />
      <div className={"flex flex-col mt-6 h-2 bg-black-100 rounded-10px max-w-[100px]"} />
      <div className={"flex flex-col my-2 h-2 bg-black-100 rounded-10px max-w-[100px]"} />
    </div>
  </div>
);

export default getEmailPreviewLoader;
