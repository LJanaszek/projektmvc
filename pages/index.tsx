import MainContainer from "@/components/mainContainer";

export default function Home() {
  return (
    <>
      <MainContainer />
    </>
  );
}


export function fetchProjects(){
  const a = [{
    id: 1,
    name: "test",
    description: "test",},
  {
    id: 2,
    name: "test2",
    description: "test2",
  }]
  return JSON.stringify(a);
}
