import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const CardCustom = ({ text, header, img, desc }: { text: string; header: string; img: string; desc?: string }) => {
  return (
    <Card className="col-span-2 min-w-64 max-w-80">
      <CardHeader>
        <CardTitle>{header}</CardTitle>
        {desc && <CardDescription>{desc}</CardDescription>}
      </CardHeader>
      <CardContent className=" flex flex-col">
        <p>{text}</p>
        {img && <img className=" mx-auto my-2 w-40" src={img} alt="img" />}
      </CardContent>
    </Card>
  );
};

export default CardCustom;
