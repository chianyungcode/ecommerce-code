import { UserButton, auth } from "@clerk/nextjs";
import React from "react";
import MainNav from "@/components/own/main-nav";
import StoreSwitcher from "@/components/own/store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  // Idealnya, operasi database seperti ini seharusnya diletakkan di server.
  // Kemudian, kita dapat memanggil API dari komponen Navbar ini.
  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
