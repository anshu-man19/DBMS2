import { withAuth } from "next-auth/middleware";

export default withAuth({
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret",
  pages: {
    signIn: "/login"
  },
  callbacks: {
    authorized: ({ req, token }) => {
      const pathname = req.nextUrl.pathname;

      if (pathname === "/admin/login") {
        return true;
      }

      if (!token?.role || !token?.apiToken) {
        return false;
      }

      if (pathname.startsWith("/admin")) {
        return token?.role === "admin";
      }

      if (pathname.startsWith("/dashboard") || pathname.startsWith("/jnf") || pathname.startsWith("/inf")) {
        return token?.role === "company";
      }

      return true;
    }
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/jnf/:path*", "/inf/:path*", "/admin/:path*", "/api/courses/:path*"]
};
