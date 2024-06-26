"use client";

import React from "react";
import MangaGrid from "@/app/[locale]/(components)/manga-grid";
import { fetchSearchMangaResult } from "./fetchSearchMangaResult";
import { useState, useEffect } from "react";
import { IMangaInfo } from "@consumet/extensions";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function UserSearchPage({
  params,
}: {
  params: { searchTitle: string };
}) {
  const { t } = useTranslation();

  // Convert into readable title
  const searchTitle = params.searchTitle.split("%20").join(" ");

  const [isLoading, setIsLoading] = useState(true);

  // Store curr page number
  const [pageNum, setPageNum] = useState<number>(1);

  // Store all manga details
  const [mangaDetails, setMangaDetails] = useState<{
    [mangaId: string]: IMangaInfo;
  }>({});

  // This function will execute when the page number, search title have changed
  useEffect(() => {
    // Content is loading
    setIsLoading(true);
    // Clear the manga details for previous page
    setMangaDetails({});
    const fetchSearchResult = async () => {
      try {
        const fetchedMangaDetails = await fetchSearchMangaResult(
          searchTitle,
          pageNum,
          18
        );
        setMangaDetails(fetchedMangaDetails);
      } catch (error) {
        console.log(t("errMsg"));
      } finally {
        // Content has finished loading
        setIsLoading(false);
      }
    };

    fetchSearchResult();
  }, [pageNum, searchTitle, t]);

  // Getting an array with all the fetched manga id
  const mangaDetailsArr = Object.keys(mangaDetails);

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-10">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 text-white">
        {
          // Contents is still loading
          isLoading ? (
            <div>{t("prompt")}</div>
          ) : // Contents finished loading
          mangaDetailsArr.length !== 0 ? (
            // Each manga is associated with a different component
            mangaDetailsArr.map((mangaDetailKey) => {
              return (
                <MangaGrid
                  key={mangaDetailKey}
                  mangaInfo={mangaDetails[mangaDetailKey]}
                />
              );
            })
          ) : (
            // There are no more contents
            <div className="text-black text-nowrap">{t("prompt2")}</div>
          )
        }
      </div>
      {/* Increase and decrease button for page number */}
      <div className="flex gap-3 justify-center items-center mt-5">
        <Button
          className="bg-slate-700 text-white"
          onClick={() => setPageNum((prev) => (prev === 1 ? prev : prev - 1))}
        >
          {t("prevBtn")}
        </Button>
        <Button
          className="bg-slate-700 text-white"
          onClick={() => setPageNum((prev) => prev + 1)}
          disabled={mangaDetailsArr.length === 0}
        >
          {t("nextBtn")}
        </Button>
      </div>
    </div>
  );
}
