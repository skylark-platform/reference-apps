import { Dispatch, SetStateAction } from "react";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { Genre } from "../../../types/gql";

import { DisplayError } from "../../displayError";
import { Grid } from "../../grid";
import { useListObjects } from "../../../hooks/useListObjects";
import { LIST_GENRES } from "../../../graphql/queries";
import { SkeletonPage } from "../../generic/skeleton";
import { Dropdown } from "../../generic/dropdown";
import { H4 } from "../../generic/typography";
import { ListObjectsPageProps } from "../listObjects/listObjects.page";

interface ListWithGenreFilterPageProps extends ListObjectsPageProps {
  activeGenre: Genre | null;
  setActiveGenre: Dispatch<
    SetStateAction<{ uid: string; name: string } | null>
  >;
  hideGenreSelector: boolean;
}

export const ListObjectsWithGenreFilter: NextPage<
  ListWithGenreFilterPageProps
> = ({
  translationKeys,
  objects,
  isLoadingObjects,
  thumbnailVariant,
  activeGenre,
  hideGenreSelector,
  setActiveGenre,
}) => {
  const { objects: genres, isError: isGenreError } =
    useListObjects<Genre>(LIST_GENRES);

  const { t } = useTranslation("common");

  const updateGenre = (newGenre: string) => {
    const genre = genres?.find((g) => g.name === newGenre);
    setActiveGenre(genre ? { uid: genre?.uid, name: newGenre } : null);
  };

  if (!isLoadingObjects && isGenreError) {
    return (
      <DisplayError error={isGenreError} notFoundMessage="No Genres found." />
    );
  }

  return (
    <div className="flex w-full flex-col justify-center bg-gray-900 py-4 font-body md:py-20">
      <NextSeo title={t(translationKeys.title)} />
      <div className="px-gutter sm:px-sm-gutter md:pt-20 lg:px-lg-gutter xl:px-xl-gutter">
        <div className="my-10 text-white">
          <h1 className="text-[40px] font-medium md:text-[56px]">
            {t(translationKeys.title)}
          </h1>
          {translationKeys?.description && (
            <div className="text-[16px]">{t(translationKeys.description)}</div>
          )}
        </div>
        {!hideGenreSelector && (
          <div className="flex flex-row gap-x-2 pb-6 md:pb-16 xl:pb-20">
            <Dropdown
              items={genres?.map((genre) => genre.name || "").sort() || []}
              label="Genres"
              onChange={updateGenre}
            />
          </div>
        )}
      </div>
      {!isLoadingObjects && (!objects || objects.length === 0) && (
        <div className="text-center">
          <H4 className="mb-0.5 mt-2 text-white">{`No ${t(
            translationKeys.title,
          )} found${activeGenre ? ` for Genre: ${activeGenre.name}` : ""}`}</H4>
        </div>
      )}
      <SkeletonPage show={isLoadingObjects && !objects}>
        {objects && <Grid objects={objects} variant={thumbnailVariant} />}
      </SkeletonPage>
    </div>
  );
};
