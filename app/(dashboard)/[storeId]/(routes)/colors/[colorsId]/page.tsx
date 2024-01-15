import prismadb from "@/lib/prismadb";
import React from "react";
import ColorForm from "./components/color-form";

interface ColorsPageProps {
  params: {
    colorsId: string;
  };
}

const ColorsPage = async ({ params }: ColorsPageProps) => {
  const colors = await prismadb.color.findUnique({
    where: {
      id: params.colorsId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={colors} />
      </div>
    </div>
  );
};

export default ColorsPage;
