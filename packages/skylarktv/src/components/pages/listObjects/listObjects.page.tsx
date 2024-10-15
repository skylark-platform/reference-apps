import { NextPage } from "next";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { Episode, Metadata, Movie } from "../../../types";
import { SkeletonPage } from "../../generic/skeleton";
import { H4 } from "../../generic/typography";
import { Grid } from "../../grid";
import { ThumbnailVariant } from "../../thumbnail";

export interface ListObjectsPageProps {
  translationKeys: {
    title: string;
    description?: string;
  };
  objects: Metadata[] | Episode[] | Movie[] | null;
  isLoadingObjects: boolean;
  thumbnailVariant: ThumbnailVariant;
}

export const ListObjects: NextPage<ListObjectsPageProps> = ({
  translationKeys,
  objects,
  isLoadingObjects,
  thumbnailVariant,
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="flex w-full flex-col justify-center bg-gray-900 py-20 font-body">
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
      </div>
      {!isLoadingObjects && (!objects || objects.length === 0) && (
        <div className="text-center">
          <H4 className="mb-0.5 mt-2 text-white">{`No ${t(
            translationKeys.title,
          )} found`}</H4>
        </div>
      )}
      <SkeletonPage show={isLoadingObjects && !objects}>
        {objects && <Grid objects={objects} variant={thumbnailVariant} />}
      </SkeletonPage>
    </div>
  );
};
