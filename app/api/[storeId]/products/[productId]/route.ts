import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        image: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("API ERROR [GET]: /api/[storeId]/products/[productId]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    const { userId } = auth();

    const {
      name,
      image,
      price,
      isFeatured,
      isArchived,
      colorId,
      categoryId,
      sizeId,
    } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!image || !image.length) {
      return new NextResponse("Image are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        image: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const updatedProduct = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        image: {
          createMany: {
            data: [...image.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.log(
      "API ERROR [PATCH]: /api/[storeId]/products/[productId]",
      error,
    );
    return new NextResponse("Failed to update", { status: 500 });
  }
}
