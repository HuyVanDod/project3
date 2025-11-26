import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",       // Cloudinary
      "encrypted-tbn0.gstatic.com",// Ảnh Google (vd: ảnh tìm kiếm, thumbnail)
      "traicaytonyteo.com", // 👈 thêm domain này
      "hatgiongsach.com",
      "tfruit.com.vn",
      "file.hstatic.net",
      "traicayxanh.vn",
       "vaithieu.net",
       "afamilycdn.com",
       "eakmat.vn",
       "www.conngongvang.com",
        "media.istockphoto.com",
        "hoaquafuji.com",
        "traicay141.vn",
         "traicaynhapkhausach.vn",
         "cdn.tgdd.vn",
          "cicin.vn",
          "www.lottemart.vn",
        "xoaisaydeo.com",
        "product.hstatic.net",
        "nld.mediacdn.vn",
         "bizweb.dktcdn.net",
         "danviet.ex-cdn.com",
         "cdn.abphotos.link",
          "phunuvietnam.mediacdn.vn",
           "media.vietnamplus.vn",
            "vinfruits.com",
             "upload.wikimedia.org"

    ],
  },
};

export default nextConfig;
