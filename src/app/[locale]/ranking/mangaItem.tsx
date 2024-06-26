"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { IMangaInfo, IMangaResult } from "@consumet/extensions";
import LoveBtn from "../(components)/love-btn";
import { useTranslation } from "react-i18next";
import { CLOUDINARY_BASE_URL } from "../(components)/constants";

export default function MangaItem({
  mangaInfo,
  index,
  manga,
}: {
  mangaInfo: IMangaInfo;
  index: number;
  manga: IMangaResult;
}) {
  const { t } = useTranslation();
  // Initialize 2 variables using useState, default value for isExpanded is false, setIsExpanded is a setter
  const [isExpanded, setIsExpanded] = useState(false);

  // Return a manga section
  return (
    <li
      className="p-5 bg-black border border-gray-500 rounded-lg relative hover:bg-gray-800 transition-all w-full"
      key={mangaInfo.id}
    >
      <div className="flex space-y-4 md:space-x-4 md:flex-row flex-col justify-center place-items-center">
        {/* The numbering for the manga */}
        <div className="self-start md:self-center pl-5 pr-2 font-bold text-3xl">
          {index + 1}
        </div>

        {/* Making only the image of manga is clickable, to watch the manga */}
        <Link href={`manga/${mangaInfo.id}`}>
          <Image
            className="aspect-[3/4]"
            src={CLOUDINARY_BASE_URL + mangaInfo?.image}
            width={200}
            height={400}
            alt="cover image"
          />
        </Link>

        {/* Listing the information of the manga */}
        <div className="w-3/4">
          <p>
            {t("title")}: {manga.title as string}
          </p>
          <p>
            {t("year")}: {mangaInfo.releaseDate}
          </p>
          <p>
            {t("status")}: {mangaInfo.status}
          </p>
          <div className="flex flex-wrap w-full">
            {t("genre")}:{" "}
            {mangaInfo.genres?.map((genre) => {
              return (
                <span className="px-2 rounded-md bg-gray-600 m-1" key={genre}>
                  {genre}
                </span>
              );
            })}
          </div>
          <br />
          <hr />

          {/* Making Read more and Read less function for the long description */}
          <p>{t("desc")}: </p>
          <section
            className={`${
              isExpanded ? "overflow-y-scroll h-20" : "line-clamp-1"
            } `}
          >
            {(mangaInfo.description as { en: string })?.en}
          </section>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:text-blue-700"
          >
            {isExpanded ? `${t("noscroll")}` : `${t("scroll")}`}
          </button>
        </div>
      </div>
      <div className="absolute top-[15px] right-[15px] hover:opacity-75 transition-opacity">
        <LoveBtn mangaId={mangaInfo.id} />
      </div>
    </li>
  );
}
