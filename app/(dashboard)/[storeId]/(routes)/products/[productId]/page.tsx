import prismadb from "@/lib/prismadb";
import React from "react";
import ProductForm from "./components/product-form";

interface ProductPageProps {
  params: {
    productId: string;
    storeId: string;
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      image: true,
    },
  });

  const category = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={category}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default ProductPage;
