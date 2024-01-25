import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import BillboardClient from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: { storeId: params.storeId },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => {
    return {
      id: item.id,
      name: item.name,
      price: formatter.format(item.price.toNumber()),
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
      color: item.color.value,
      category: item.category.name,
      size: item.size.value,
    };
  });

  return (
    <div className="flex">
      <div className="flex-1 space-y-4  p-8 pt-6">
        <BillboardClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
