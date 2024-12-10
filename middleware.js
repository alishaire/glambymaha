import { NextResponse } from "next/server";
import { JWTVerify } from "./helpers/jwt";

export async function middleware(req, res) {
  var pathname = req.nextUrl.pathname;
  var token = req.cookies.get("AccessToken")?.value;
  var userID = token && (await JWTVerify(token));

  const publicRoutes = ["/", "/login", "/register"];

  const loginNotAllowedPaths = ["/login", "/register"];

  if (!userID && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (userID && loginNotAllowedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  var user = await fetch(
    `https://u-shop-liart.vercel.app/api/auth/profile?id=${userID}`
  );
  user = await user.json();
  user = user.message;

  if (user) {
    const userRole = user.role;

    // restricted routes for user ----------------
    const restrictedRoutesForUser = [
      "/dashboard",
      "/dashboard/users",
      "/dashboard/category",
      "/dashboard/products",
      "/dashboard/sales-banner",
      "/dashboard/products/createproduct",
      "/dashboard/products/edit-product",
    ];

    // Check if the user has the role "user" then redirect the user dashboard only
    if (userRole === "user") {
      if (restrictedRoutesForUser.includes(pathname)) {
        return NextResponse.redirect(
          new URL("/dashboard/user-portal", req.nextUrl)
        );
      }
    }
  }
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard", "/dashboard/:path*"],
};
