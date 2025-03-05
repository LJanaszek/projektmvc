import MainContainer from "@/components/mainContainer";

export default function Home() {
  return (
    <>
      <MainContainer />
    </>
  );
}


export function fetchProjects(){
  const a = {
    id: 1,
    name: "test",
    description: "test",}
  return JSON.stringify(a);
}
