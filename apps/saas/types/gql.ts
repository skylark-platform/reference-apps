/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDateTime: any;
};

export type Asset = Metadata & {
  __typename?: 'Asset';
  _meta?: Maybe<_AssetMeta>;
  asset_type: Scalars['String'];
  asset_url?: Maybe<Scalars['String']>;
  availability?: Maybe<AvailabilityListing>;
  external_id?: Maybe<Scalars['String']>;
  images?: Maybe<ImageListing>;
  parental_guidance?: Maybe<ParentalGuidanceListing>;
  parents?: Maybe<EntertainmentListing>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};


export type Asset_MetaArgs = {
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
};


export type AssetAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type AssetImagesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type AssetParental_GuidanceArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type AssetParentsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type AssetInput = {
  asset_type?: InputMaybe<Scalars['String']>;
  asset_url?: InputMaybe<Scalars['String']>;
  availability?: InputMaybe<AssignAvailabilityInput>;
  data_source_fields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  data_source_id?: InputMaybe<Scalars['String']>;
  external_id?: InputMaybe<Scalars['String']>;
  relationships?: InputMaybe<AssetRelationships>;
  slug?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type AssetListing = Listing & {
  __typename?: 'AssetListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Asset>>>;
};

export type AssetRelationshipInput = {
  create?: InputMaybe<Array<InputMaybe<AssetInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type AssetRelationships = {
  images?: InputMaybe<ImageRelationshipInput>;
  parental_guidance?: InputMaybe<ParentalGuidanceRelationshipInput>;
};

export type AssignAvailabilityInput = {
  create?: InputMaybe<Array<InputMaybe<AvailabilityInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type AssignDimensionInput = {
  dimension_slug?: InputMaybe<Scalars['String']>;
  value_slugs?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Availability = {
  __typename?: 'Availability';
  _meta?: Maybe<_AvailabilityMeta>;
  dimensions?: Maybe<Array<Maybe<DimensionAssigned>>>;
  end?: Maybe<Scalars['AWSDateTime']>;
  slug?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
  uid?: Maybe<Scalars['String']>;
};

export type AvailabilityInput = {
  dimensions?: InputMaybe<Array<InputMaybe<AssignDimensionInput>>>;
  end?: InputMaybe<Scalars['AWSDateTime']>;
  slug?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['AWSDateTime']>;
  title?: InputMaybe<Scalars['String']>;
};

export type AvailabilityListing = {
  __typename?: 'AvailabilityListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Availability>>>;
};

export type Brand = CurationMetadata & Entertainment & {
  __typename?: 'Brand';
  _meta?: Maybe<_BrandMeta>;
  assets?: Maybe<AssetListing>;
  availability?: Maybe<AvailabilityListing>;
  credits?: Maybe<CreditListing>;
  episodes?: Maybe<EpisodeListing>;
  external_id?: Maybe<Scalars['String']>;
  genres?: Maybe<GenreListing>;
  images?: Maybe<ImageListing>;
  movies?: Maybe<MovieListing>;
  ratings?: Maybe<RatingListing>;
  seasons?: Maybe<SeasonListing>;
  sets?: Maybe<SetListing>;
  slug?: Maybe<Scalars['String']>;
  synopsis_long?: Maybe<Scalars['String']>;
  synopsis_medium?: Maybe<Scalars['String']>;
  synopsis_short?: Maybe<Scalars['String']>;
  tags?: Maybe<TagListing>;
  themes?: Maybe<ThemeListing>;
  title?: Maybe<Scalars['String']>;
  title_long?: Maybe<Scalars['String']>;
  title_medium?: Maybe<Scalars['String']>;
  title_short?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};


export type Brand_MetaArgs = {
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
};


export type BrandAssetsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type BrandAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type BrandCreditsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type BrandEpisodesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type BrandGenresArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type BrandImagesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type BrandMoviesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type BrandRatingsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type BrandSeasonsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type BrandSetsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type BrandTagsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type BrandThemesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type BrandInput = {
  availability?: InputMaybe<AssignAvailabilityInput>;
  data_source_fields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  data_source_id?: InputMaybe<Scalars['String']>;
  external_id?: InputMaybe<Scalars['String']>;
  relationships?: InputMaybe<BrandRelationships>;
  slug?: InputMaybe<Scalars['String']>;
  synopsis_long?: InputMaybe<Scalars['String']>;
  synopsis_medium?: InputMaybe<Scalars['String']>;
  synopsis_short?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  title_long?: InputMaybe<Scalars['String']>;
  title_medium?: InputMaybe<Scalars['String']>;
  title_short?: InputMaybe<Scalars['String']>;
};

export type BrandListing = Listing & {
  __typename?: 'BrandListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Brand>>>;
};

export type BrandRelationshipInput = {
  create?: InputMaybe<Array<InputMaybe<BrandInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type BrandRelationships = {
  assets?: InputMaybe<AssetRelationshipInput>;
  brands?: InputMaybe<BrandRelationshipInput>;
  credits?: InputMaybe<CreditRelationshipInput>;
  episodes?: InputMaybe<EpisodeRelationshipInput>;
  genres?: InputMaybe<GenreRelationshipInput>;
  images?: InputMaybe<ImageRelationshipInput>;
  movies?: InputMaybe<MovieRelationshipInput>;
  ratings?: InputMaybe<RatingRelationshipInput>;
  seasons?: InputMaybe<SeasonRelationshipInput>;
  tags?: InputMaybe<TagRelationshipInput>;
  themes?: InputMaybe<ThemeRelationshipInput>;
};

export type BrandSetCreate = {
  object?: InputMaybe<BrandInput>;
  position: Scalars['Int'];
};

export type BrandSetInput = {
  create?: InputMaybe<Array<InputMaybe<BrandSetCreate>>>;
  link?: InputMaybe<Array<InputMaybe<SetLink>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CountResponse = {
  __typename?: 'CountResponse';
  count?: Maybe<Scalars['Int']>;
};

export type Credit = Metadata & {
  __typename?: 'Credit';
  _meta?: Maybe<_CreditMeta>;
  availability?: Maybe<AvailabilityListing>;
  character?: Maybe<Scalars['String']>;
  external_id?: Maybe<Scalars['String']>;
  people?: Maybe<PersonListing>;
  position?: Maybe<Scalars['Int']>;
  roles?: Maybe<RoleListing>;
  slug?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};


export type Credit_MetaArgs = {
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
};


export type CreditAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type CreditPeopleArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type CreditRolesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type CreditInput = {
  availability?: InputMaybe<AssignAvailabilityInput>;
  character?: InputMaybe<Scalars['String']>;
  data_source_fields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  data_source_id?: InputMaybe<Scalars['String']>;
  external_id?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['Int']>;
  relationships?: InputMaybe<CreditRelationships>;
  slug?: InputMaybe<Scalars['String']>;
};

export type CreditListing = Listing & {
  __typename?: 'CreditListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Credit>>>;
};

export type CreditRelationshipInput = {
  create?: InputMaybe<Array<InputMaybe<CreditInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CreditRelationships = {
  people?: InputMaybe<PersonRelationshipInput>;
  roles?: InputMaybe<RoleRelationshipInput>;
};

export type CurationMetadata = {
  external_id?: Maybe<Scalars['String']>;
  sets?: Maybe<SetListing>;
  slug?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};


export type CurationMetadataSetsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type CurationMetadataListing = Listing & {
  __typename?: 'CurationMetadataListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<CurationMetadata>>>;
};

export type Dimension = {
  __typename?: 'Dimension';
  _meta?: Maybe<_DimensionMeta>;
  description?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};


export type Dimension_MetaArgs = {
  value_id?: InputMaybe<Scalars['String']>;
};

export type DimensionAssigned = {
  __typename?: 'DimensionAssigned';
  dimension_slug?: Maybe<Scalars['String']>;
  value_slugs?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type DimensionInput = {
  description?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
  title?: InputMaybe<Scalars['String']>;
};

export type DimensionValue = {
  __typename?: 'DimensionValue';
  _meta?: Maybe<_DimensionValueMeta>;
  description?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};

export type Entertainment = {
  assets?: Maybe<AssetListing>;
  availability?: Maybe<AvailabilityListing>;
  credits?: Maybe<CreditListing>;
  genres?: Maybe<GenreListing>;
  images?: Maybe<ImageListing>;
  ratings?: Maybe<RatingListing>;
  synopsis_long?: Maybe<Scalars['String']>;
  synopsis_medium?: Maybe<Scalars['String']>;
  synopsis_short?: Maybe<Scalars['String']>;
  tags?: Maybe<TagListing>;
  themes?: Maybe<ThemeListing>;
  title?: Maybe<Scalars['String']>;
  title_long?: Maybe<Scalars['String']>;
  title_medium?: Maybe<Scalars['String']>;
  title_short?: Maybe<Scalars['String']>;
};


export type EntertainmentAssetsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EntertainmentAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EntertainmentCreditsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EntertainmentGenresArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EntertainmentImagesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EntertainmentRatingsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EntertainmentTagsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EntertainmentThemesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type EntertainmentListing = {
  __typename?: 'EntertainmentListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Entertainment>>>;
};

export type Episode = CurationMetadata & Entertainment & {
  __typename?: 'Episode';
  _meta?: Maybe<_EpisodeMeta>;
  assets?: Maybe<AssetListing>;
  availability?: Maybe<AvailabilityListing>;
  brands?: Maybe<BrandListing>;
  credits?: Maybe<CreditListing>;
  episode_number?: Maybe<Scalars['Int']>;
  external_id?: Maybe<Scalars['String']>;
  genres?: Maybe<GenreListing>;
  images?: Maybe<ImageListing>;
  ratings?: Maybe<RatingListing>;
  seasons?: Maybe<SeasonListing>;
  sets?: Maybe<SetListing>;
  slug?: Maybe<Scalars['String']>;
  synopsis_long?: Maybe<Scalars['String']>;
  synopsis_medium?: Maybe<Scalars['String']>;
  synopsis_short?: Maybe<Scalars['String']>;
  tags?: Maybe<TagListing>;
  themes?: Maybe<ThemeListing>;
  title?: Maybe<Scalars['String']>;
  title_long?: Maybe<Scalars['String']>;
  title_medium?: Maybe<Scalars['String']>;
  title_short?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};


export type Episode_MetaArgs = {
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
};


export type EpisodeAssetsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EpisodeAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EpisodeBrandsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EpisodeCreditsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EpisodeGenresArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EpisodeImagesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EpisodeRatingsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EpisodeSeasonsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EpisodeSetsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EpisodeTagsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type EpisodeThemesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type EpisodeInput = {
  availability?: InputMaybe<AssignAvailabilityInput>;
  data_source_fields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  data_source_id?: InputMaybe<Scalars['String']>;
  episode_number?: InputMaybe<Scalars['Int']>;
  external_id?: InputMaybe<Scalars['String']>;
  relationships?: InputMaybe<EpisodeRelationships>;
  slug?: InputMaybe<Scalars['String']>;
  synopsis_long?: InputMaybe<Scalars['String']>;
  synopsis_medium?: InputMaybe<Scalars['String']>;
  synopsis_short?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  title_long?: InputMaybe<Scalars['String']>;
  title_medium?: InputMaybe<Scalars['String']>;
  title_short?: InputMaybe<Scalars['String']>;
};

export type EpisodeListing = Listing & {
  __typename?: 'EpisodeListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Episode>>>;
};

export type EpisodeRelationshipInput = {
  create?: InputMaybe<Array<InputMaybe<EpisodeInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type EpisodeRelationships = {
  assets?: InputMaybe<AssetRelationshipInput>;
  brands?: InputMaybe<BrandRelationshipInput>;
  credits?: InputMaybe<CreditRelationshipInput>;
  genres?: InputMaybe<GenreRelationshipInput>;
  images?: InputMaybe<ImageRelationshipInput>;
  ratings?: InputMaybe<RatingRelationshipInput>;
  seasons?: InputMaybe<SeasonRelationshipInput>;
  tags?: InputMaybe<TagRelationshipInput>;
  themes?: InputMaybe<ThemeRelationshipInput>;
};

export type EpisodeSetCreate = {
  object?: InputMaybe<EpisodeInput>;
  position: Scalars['Int'];
};

export type EpisodeSetInput = {
  create?: InputMaybe<Array<InputMaybe<EpisodeSetCreate>>>;
  link?: InputMaybe<Array<InputMaybe<SetLink>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Genre = CurationMetadata & {
  __typename?: 'Genre';
  _meta?: Maybe<_GenreMeta>;
  availability?: Maybe<AvailabilityListing>;
  external_id?: Maybe<Scalars['String']>;
  metadata_source?: Maybe<Scalars['String']>;
  movies?: Maybe<MovieListing>;
  name?: Maybe<Scalars['String']>;
  parents?: Maybe<EntertainmentListing>;
  sets?: Maybe<SetListing>;
  slug?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};


export type Genre_MetaArgs = {
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
};


export type GenreAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type GenreMoviesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type GenreParentsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type GenreSetsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type GenreInput = {
  availability?: InputMaybe<AssignAvailabilityInput>;
  data_source_fields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  data_source_id?: InputMaybe<Scalars['String']>;
  external_id?: InputMaybe<Scalars['String']>;
  metadata_source?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type GenreListing = Listing & {
  __typename?: 'GenreListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Genre>>>;
};

export type GenreRelationshipInput = {
  create?: InputMaybe<Array<InputMaybe<GenreInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type GenreSetCreate = {
  object?: InputMaybe<GenreInput>;
  position: Scalars['Int'];
};

export type GenreSetInput = {
  create?: InputMaybe<Array<InputMaybe<GenreSetCreate>>>;
  link?: InputMaybe<Array<InputMaybe<SetLink>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Image = Metadata & {
  __typename?: 'Image';
  _meta?: Maybe<_ImageMeta>;
  availability?: Maybe<AvailabilityListing>;
  description?: Maybe<Scalars['String']>;
  external_id?: Maybe<Scalars['String']>;
  image_type?: Maybe<Scalars['String']>;
  image_url?: Maybe<Scalars['String']>;
  parents?: Maybe<EntertainmentListing>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};


export type Image_MetaArgs = {
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
};


export type ImageAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type ImageInput = {
  availability?: InputMaybe<AssignAvailabilityInput>;
  data_source_fields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  data_source_id?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  external_id?: InputMaybe<Scalars['String']>;
  image_type?: InputMaybe<Scalars['String']>;
  image_url?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type ImageListing = Listing & {
  __typename?: 'ImageListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Image>>>;
};

export type ImageRelationshipInput = {
  create?: InputMaybe<Array<InputMaybe<ImageInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ImageSetCreate = {
  object?: InputMaybe<ImageInput>;
  position: Scalars['Int'];
};

export type ImageSetInput = {
  create?: InputMaybe<Array<InputMaybe<ImageSetCreate>>>;
  link?: InputMaybe<Array<InputMaybe<SetLink>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Listing = {
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
};

export type Metadata = {
  external_id?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};

export type Movie = CurationMetadata & Entertainment & {
  __typename?: 'Movie';
  _meta?: Maybe<_MovieMeta>;
  assets?: Maybe<AssetListing>;
  availability?: Maybe<AvailabilityListing>;
  brands?: Maybe<BrandListing>;
  credits?: Maybe<CreditListing>;
  external_id?: Maybe<Scalars['String']>;
  genres?: Maybe<GenreListing>;
  images?: Maybe<ImageListing>;
  ratings?: Maybe<RatingListing>;
  sets?: Maybe<SetListing>;
  slug?: Maybe<Scalars['String']>;
  synopsis_long?: Maybe<Scalars['String']>;
  synopsis_medium?: Maybe<Scalars['String']>;
  synopsis_short?: Maybe<Scalars['String']>;
  tags?: Maybe<TagListing>;
  themes?: Maybe<ThemeListing>;
  title?: Maybe<Scalars['String']>;
  title_long?: Maybe<Scalars['String']>;
  title_medium?: Maybe<Scalars['String']>;
  title_short?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
  year_of_release?: Maybe<Scalars['Int']>;
};


export type Movie_MetaArgs = {
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
};


export type MovieAssetsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type MovieAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type MovieBrandsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type MovieCreditsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type MovieGenresArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type MovieImagesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type MovieRatingsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type MovieSetsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type MovieTagsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type MovieThemesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type MovieInput = {
  availability?: InputMaybe<AssignAvailabilityInput>;
  data_source_fields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  data_source_id?: InputMaybe<Scalars['String']>;
  external_id?: InputMaybe<Scalars['String']>;
  relationships?: InputMaybe<MovieRelationships>;
  slug?: InputMaybe<Scalars['String']>;
  synopsis_long?: InputMaybe<Scalars['String']>;
  synopsis_medium?: InputMaybe<Scalars['String']>;
  synopsis_short?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  title_long?: InputMaybe<Scalars['String']>;
  title_medium?: InputMaybe<Scalars['String']>;
  title_short?: InputMaybe<Scalars['String']>;
  year_of_release?: InputMaybe<Scalars['Int']>;
};

export type MovieListing = Listing & {
  __typename?: 'MovieListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Movie>>>;
};

export type MovieRelationshipInput = {
  create?: InputMaybe<Array<InputMaybe<MovieInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MovieRelationships = {
  assets?: InputMaybe<AssetRelationshipInput>;
  brands?: InputMaybe<BrandRelationshipInput>;
  credits?: InputMaybe<CreditRelationshipInput>;
  genres?: InputMaybe<GenreRelationshipInput>;
  images?: InputMaybe<ImageRelationshipInput>;
  ratings?: InputMaybe<RatingRelationshipInput>;
  tags?: InputMaybe<TagRelationshipInput>;
  themes?: InputMaybe<ThemeRelationshipInput>;
};

export type MovieSetCreate = {
  object?: InputMaybe<MovieInput>;
  position: Scalars['Int'];
};

export type MovieSetInput = {
  create?: InputMaybe<Array<InputMaybe<MovieSetCreate>>>;
  link?: InputMaybe<Array<InputMaybe<SetLink>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAsset?: Maybe<Asset>;
  createAvailability?: Maybe<Availability>;
  createBrand?: Maybe<Brand>;
  createCredit?: Maybe<Credit>;
  createDimension?: Maybe<Dimension>;
  createDimensionValue?: Maybe<DimensionValue>;
  createEpisode?: Maybe<Episode>;
  createGenre?: Maybe<Genre>;
  createImage?: Maybe<Image>;
  createMovie?: Maybe<Movie>;
  createParentalGuidance?: Maybe<ParentalGuidance>;
  createPerson?: Maybe<Person>;
  createRating?: Maybe<Rating>;
  createRole?: Maybe<Role>;
  createSeason?: Maybe<Season>;
  createSet?: Maybe<Set>;
  createTag?: Maybe<Tag>;
  createTheme?: Maybe<Theme>;
  deleteAsset?: Maybe<Array<Maybe<ObjectDeleteResponse>>>;
  deleteAvailability?: Maybe<Scalars['String']>;
  deleteBrand?: Maybe<Array<Maybe<ObjectDeleteResponse>>>;
  deleteCredit?: Maybe<Array<Maybe<ObjectDeleteResponse>>>;
  deleteDimension?: Maybe<Scalars['String']>;
  deleteDimensionValue?: Maybe<Scalars['String']>;
  deleteEpisode?: Maybe<Array<Maybe<ObjectDeleteResponse>>>;
  deleteGenre?: Maybe<Array<Maybe<ObjectDeleteResponse>>>;
  deleteImage?: Maybe<Array<Maybe<ObjectDeleteResponse>>>;
  deleteMovie?: Maybe<Array<Maybe<ObjectDeleteResponse>>>;
  deleteParentalGuidance?: Maybe<Array<Maybe<ObjectDeleteResponse>>>;
  deletePerson?: Maybe<Array<Maybe<ObjectDeleteResponse>>>;
  deleteRating?: Maybe<Array<Maybe<ObjectDeleteResponse>>>;
  deleteRole?: Maybe<Array<Maybe<ObjectDeleteResponse>>>;
  deleteSeason?: Maybe<Array<Maybe<ObjectDeleteResponse>>>;
  deleteSet?: Maybe<Array<Maybe<ObjectDeleteResponse>>>;
  deleteTag?: Maybe<Array<Maybe<ObjectDeleteResponse>>>;
  deleteTheme?: Maybe<Array<Maybe<ObjectDeleteResponse>>>;
  updateAsset?: Maybe<Asset>;
  updateAvailability?: Maybe<Availability>;
  updateBrand?: Maybe<Brand>;
  updateCredit?: Maybe<Credit>;
  updateDimension?: Maybe<DimensionValue>;
  updateDimensionValue?: Maybe<DimensionValue>;
  updateEpisode?: Maybe<Episode>;
  updateGenre?: Maybe<Genre>;
  updateImage?: Maybe<Image>;
  updateMovie?: Maybe<Movie>;
  updateParentalGuidance?: Maybe<ParentalGuidance>;
  updatePerson?: Maybe<Person>;
  updateRating?: Maybe<Rating>;
  updateRole?: Maybe<Role>;
  updateSeason?: Maybe<Season>;
  updateSet?: Maybe<Set>;
  updateTag?: Maybe<Tag>;
  updateTheme?: Maybe<Theme>;
};


export type MutationCreateAssetArgs = {
  asset?: InputMaybe<AssetInput>;
  language?: InputMaybe<Scalars['String']>;
};


export type MutationCreateAvailabilityArgs = {
  availability: AvailabilityInput;
};


export type MutationCreateBrandArgs = {
  brand?: InputMaybe<BrandInput>;
  language?: InputMaybe<Scalars['String']>;
};


export type MutationCreateCreditArgs = {
  credit?: InputMaybe<CreditInput>;
  language?: InputMaybe<Scalars['String']>;
};


export type MutationCreateDimensionArgs = {
  dimension: DimensionInput;
};


export type MutationCreateDimensionValueArgs = {
  dimension_id: Scalars['String'];
  dimension_value?: InputMaybe<DimensionInput>;
};


export type MutationCreateEpisodeArgs = {
  episode?: InputMaybe<EpisodeInput>;
  language?: InputMaybe<Scalars['String']>;
};


export type MutationCreateGenreArgs = {
  genre?: InputMaybe<GenreInput>;
  language?: InputMaybe<Scalars['String']>;
};


export type MutationCreateImageArgs = {
  image?: InputMaybe<EpisodeInput>;
  language?: InputMaybe<Scalars['String']>;
};


export type MutationCreateMovieArgs = {
  language?: InputMaybe<Scalars['String']>;
  movie?: InputMaybe<MovieInput>;
};


export type MutationCreateParentalGuidanceArgs = {
  language?: InputMaybe<Scalars['String']>;
  parental_guidance?: InputMaybe<ParentalGuidanceInput>;
};


export type MutationCreatePersonArgs = {
  language?: InputMaybe<Scalars['String']>;
  person?: InputMaybe<PersonInput>;
};


export type MutationCreateRatingArgs = {
  language?: InputMaybe<Scalars['String']>;
  rating?: InputMaybe<RatingInput>;
};


export type MutationCreateRoleArgs = {
  language?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<RoleInput>;
};


export type MutationCreateSeasonArgs = {
  language?: InputMaybe<Scalars['String']>;
  season?: InputMaybe<SeasonInput>;
};


export type MutationCreateSetArgs = {
  language?: InputMaybe<Scalars['String']>;
  set?: InputMaybe<SetInput>;
};


export type MutationCreateTagArgs = {
  language?: InputMaybe<Scalars['String']>;
  tag?: InputMaybe<TagInput>;
};


export type MutationCreateThemeArgs = {
  language?: InputMaybe<Scalars['String']>;
  theme?: InputMaybe<ThemeInput>;
};


export type MutationDeleteAssetArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid: Scalars['String'];
};


export type MutationDeleteAvailabilityArgs = {
  uid: Scalars['String'];
};


export type MutationDeleteBrandArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid: Scalars['String'];
};


export type MutationDeleteCreditArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid: Scalars['String'];
};


export type MutationDeleteDimensionArgs = {
  dimension_id: Scalars['String'];
};


export type MutationDeleteDimensionValueArgs = {
  dimension_id: Scalars['String'];
  value_id: Scalars['String'];
};


export type MutationDeleteEpisodeArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid: Scalars['String'];
};


export type MutationDeleteGenreArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid: Scalars['String'];
};


export type MutationDeleteImageArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid: Scalars['String'];
};


export type MutationDeleteMovieArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid: Scalars['String'];
};


export type MutationDeleteParentalGuidanceArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid: Scalars['String'];
};


export type MutationDeletePersonArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid: Scalars['String'];
};


export type MutationDeleteRatingArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid: Scalars['String'];
};


export type MutationDeleteRoleArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid: Scalars['String'];
};


export type MutationDeleteSeasonArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid: Scalars['String'];
};


export type MutationDeleteSetArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type MutationDeleteTagArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid: Scalars['String'];
};


export type MutationDeleteThemeArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid: Scalars['String'];
};


export type MutationUpdateAssetArgs = {
  asset?: InputMaybe<AssetInput>;
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateAvailabilityArgs = {
  availability: AvailabilityInput;
  uid: Scalars['String'];
};


export type MutationUpdateBrandArgs = {
  brand?: InputMaybe<BrandInput>;
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateCreditArgs = {
  credit?: InputMaybe<CreditInput>;
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateDimensionArgs = {
  dimension?: InputMaybe<DimensionInput>;
  dimension_id: Scalars['String'];
};


export type MutationUpdateDimensionValueArgs = {
  dimension_id: Scalars['String'];
  dimension_value?: InputMaybe<DimensionInput>;
  value_id: Scalars['String'];
};


export type MutationUpdateEpisodeArgs = {
  episode?: InputMaybe<EpisodeInput>;
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateGenreArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  genre?: InputMaybe<GenreInput>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateImageArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  image?: InputMaybe<ImageInput>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateMovieArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  movie?: InputMaybe<MovieInput>;
  uid?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateParentalGuidanceArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  parental_guidance?: InputMaybe<ParentalGuidanceInput>;
  uid?: InputMaybe<Scalars['String']>;
};


export type MutationUpdatePersonArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  person?: InputMaybe<PersonInput>;
  uid?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateRatingArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  rating?: InputMaybe<RatingInput>;
  uid?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateRoleArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  role?: InputMaybe<RoleInput>;
  uid?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateSeasonArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  season?: InputMaybe<SeasonInput>;
  uid?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateSetArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  set?: InputMaybe<SetInput>;
  uid?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateTagArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  tag?: InputMaybe<TagInput>;
  uid?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateThemeArgs = {
  external_id?: InputMaybe<Scalars['String']>;
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
  theme?: InputMaybe<ThemeInput>;
  uid?: InputMaybe<Scalars['String']>;
};

export type ObjectDeleteResponse = {
  __typename?: 'ObjectDeleteResponse';
  global_version?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  language_version?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  removed_relationships?: Maybe<Array<Maybe<Scalars['String']>>>;
  uid: Scalars['String'];
};

export type ParentalGuidance = Metadata & {
  __typename?: 'ParentalGuidance';
  _meta?: Maybe<_ParentalGuidanceMeta>;
  assets?: Maybe<AssetListing>;
  availability?: Maybe<AvailabilityListing>;
  external_id?: Maybe<Scalars['String']>;
  ratings?: Maybe<RatingListing>;
  reason?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};


export type ParentalGuidance_MetaArgs = {
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
};


export type ParentalGuidanceAssetsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type ParentalGuidanceAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type ParentalGuidanceRatingsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type ParentalGuidanceInput = {
  availability?: InputMaybe<AssignAvailabilityInput>;
  data_source_fields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  data_source_id?: InputMaybe<Scalars['String']>;
  external_id?: InputMaybe<Scalars['String']>;
  reason?: InputMaybe<Scalars['String']>;
  relationships?: InputMaybe<ParentalGuidanceRelationships>;
  slug?: InputMaybe<Scalars['String']>;
};

export type ParentalGuidanceListing = Listing & {
  __typename?: 'ParentalGuidanceListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<ParentalGuidance>>>;
};

export type ParentalGuidanceRelationshipInput = {
  create?: InputMaybe<Array<InputMaybe<ParentalGuidanceInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ParentalGuidanceRelationships = {
  ratings?: InputMaybe<RatingRelationshipInput>;
};

export type Person = CurationMetadata & {
  __typename?: 'Person';
  _meta?: Maybe<_PersonMeta>;
  abbreviation?: Maybe<Scalars['String']>;
  alias?: Maybe<Scalars['String']>;
  availability?: Maybe<AvailabilityListing>;
  bio_long?: Maybe<Scalars['String']>;
  bio_medium?: Maybe<Scalars['String']>;
  bio_short?: Maybe<Scalars['String']>;
  credits?: Maybe<CreditListing>;
  date_of_birth?: Maybe<Scalars['AWSDateTime']>;
  external_id?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  images?: Maybe<ImageListing>;
  name?: Maybe<Scalars['String']>;
  name_sort?: Maybe<Scalars['String']>;
  place_of_birth?: Maybe<Scalars['String']>;
  sets?: Maybe<SetListing>;
  slug?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};


export type Person_MetaArgs = {
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
};


export type PersonAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type PersonCreditsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type PersonImagesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type PersonSetsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type PersonInput = {
  abbreviation?: InputMaybe<Scalars['String']>;
  alias?: InputMaybe<Scalars['String']>;
  availability?: InputMaybe<AssignAvailabilityInput>;
  bio_long?: InputMaybe<Scalars['String']>;
  bio_medium?: InputMaybe<Scalars['String']>;
  bio_short?: InputMaybe<Scalars['String']>;
  data_source_fields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  data_source_id?: InputMaybe<Scalars['String']>;
  date_of_birth?: InputMaybe<Scalars['AWSDateTime']>;
  external_id?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  name_sort?: InputMaybe<Scalars['String']>;
  place_of_birth?: InputMaybe<Scalars['String']>;
  relationships?: InputMaybe<PersonRelationships>;
  slug?: InputMaybe<Scalars['String']>;
};

export type PersonListing = Listing & {
  __typename?: 'PersonListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Person>>>;
};

export type PersonRelationshipInput = {
  create?: InputMaybe<Array<InputMaybe<PersonInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PersonRelationships = {
  credits?: InputMaybe<CreditRelationshipInput>;
  images?: InputMaybe<ImageRelationshipInput>;
};

export type PersonSetCreate = {
  object?: InputMaybe<PersonInput>;
  position: Scalars['Int'];
};

export type PersonSetInput = {
  create?: InputMaybe<Array<InputMaybe<PersonSetCreate>>>;
  link?: InputMaybe<Array<InputMaybe<SetLink>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export enum PublishStage {
  Archive = 'ARCHIVE',
  Preview = 'PREVIEW',
  Prod = 'PROD'
}

export type Query = {
  __typename?: 'Query';
  getAsset?: Maybe<Asset>;
  getAvailability?: Maybe<Availability>;
  getBrand?: Maybe<Brand>;
  getCredit?: Maybe<Credit>;
  getDimension?: Maybe<Dimension>;
  getEpisode?: Maybe<Episode>;
  getGenre?: Maybe<Genre>;
  getImage?: Maybe<Image>;
  getMovie?: Maybe<Movie>;
  getParentalGuidance?: Maybe<ParentalGuidance>;
  getPerson?: Maybe<Person>;
  getRating?: Maybe<Rating>;
  getRole?: Maybe<Role>;
  getSeason?: Maybe<Season>;
  getSet?: Maybe<Set>;
  getTag?: Maybe<Tag>;
  getTheme?: Maybe<Theme>;
  listAsset?: Maybe<AssetListing>;
  listAvailability?: Maybe<AvailabilityListing>;
  listBrand?: Maybe<BrandListing>;
  listCredit?: Maybe<CreditListing>;
  listDimensions?: Maybe<Array<Maybe<Dimension>>>;
  listEpisode?: Maybe<EpisodeListing>;
  listGenre?: Maybe<GenreListing>;
  listImage?: Maybe<ImageListing>;
  listMovie?: Maybe<MovieListing>;
  listParentalGuidance?: Maybe<ParentalGuidanceListing>;
  listPerson?: Maybe<PersonListing>;
  listRating?: Maybe<RatingListing>;
  listRole?: Maybe<RoleListing>;
  listSeason?: Maybe<SeasonListing>;
  listSet?: Maybe<SetListing>;
  listTag?: Maybe<TagListing>;
  listTheme?: Maybe<ThemeListing>;
};


export type QueryGetAssetArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  external_id?: InputMaybe<Scalars['String']>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type QueryGetAvailabilityArgs = {
  uid: Scalars['String'];
};


export type QueryGetBrandArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  external_id?: InputMaybe<Scalars['String']>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type QueryGetCreditArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  external_id?: InputMaybe<Scalars['String']>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type QueryGetDimensionArgs = {
  dimension_id: Scalars['String'];
};


export type QueryGetEpisodeArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  external_id?: InputMaybe<Scalars['String']>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type QueryGetGenreArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  external_id?: InputMaybe<Scalars['String']>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type QueryGetImageArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  external_id?: InputMaybe<Scalars['String']>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type QueryGetMovieArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  external_id?: InputMaybe<Scalars['String']>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type QueryGetParentalGuidanceArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  external_id?: InputMaybe<Scalars['String']>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type QueryGetPersonArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  external_id?: InputMaybe<Scalars['String']>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type QueryGetRatingArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  external_id?: InputMaybe<Scalars['String']>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type QueryGetRoleArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  external_id?: InputMaybe<Scalars['String']>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type QueryGetSeasonArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  external_id?: InputMaybe<Scalars['String']>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type QueryGetSetArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  external_id?: InputMaybe<Scalars['String']>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type QueryGetTagArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  external_id?: InputMaybe<Scalars['String']>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type QueryGetThemeArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  external_id?: InputMaybe<Scalars['String']>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
  uid?: InputMaybe<Scalars['String']>;
};


export type QueryListAssetArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
};


export type QueryListAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type QueryListBrandArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
};


export type QueryListCreditArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
};


export type QueryListEpisodeArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
};


export type QueryListGenreArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
};


export type QueryListImageArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
};


export type QueryListMovieArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
};


export type QueryListParentalGuidanceArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
};


export type QueryListPersonArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
};


export type QueryListRatingArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
};


export type QueryListRoleArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
};


export type QueryListSeasonArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
};


export type QueryListSetArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
};


export type QueryListTagArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
};


export type QueryListThemeArgs = {
  dimensions?: InputMaybe<Array<InputMaybe<UserDimension>>>;
  ignore_availability?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  time_travel?: InputMaybe<Scalars['AWSDateTime']>;
};

export type Rating = Metadata & {
  __typename?: 'Rating';
  _meta?: Maybe<_RatingMeta>;
  availability?: Maybe<AvailabilityListing>;
  description?: Maybe<Scalars['String']>;
  external_id?: Maybe<Scalars['String']>;
  parental_guidance?: Maybe<ParentalGuidanceListing>;
  parents?: Maybe<EntertainmentListing>;
  scheme?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
  value: Scalars['String'];
};


export type Rating_MetaArgs = {
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
};


export type RatingAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type RatingParental_GuidanceArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type RatingParentsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type RatingInput = {
  availability?: InputMaybe<AssignAvailabilityInput>;
  data_source_fields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  data_source_id?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  external_id?: InputMaybe<Scalars['String']>;
  scheme?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  value: Scalars['String'];
};

export type RatingListing = Listing & {
  __typename?: 'RatingListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Rating>>>;
};

export type RatingRelationshipInput = {
  create?: InputMaybe<Array<InputMaybe<RatingInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Role = Metadata & {
  __typename?: 'Role';
  _meta?: Maybe<_RoleMeta>;
  availability?: Maybe<AvailabilityListing>;
  credits?: Maybe<CreditListing>;
  external_id?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};


export type Role_MetaArgs = {
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
};


export type RoleAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type RoleCreditsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type RoleInput = {
  availability?: InputMaybe<AssignAvailabilityInput>;
  data_source_fields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  data_source_id?: InputMaybe<Scalars['String']>;
  external_id?: InputMaybe<Scalars['String']>;
  relationships?: InputMaybe<RoleRelationships>;
  title?: InputMaybe<Scalars['String']>;
};

export type RoleListing = Listing & {
  __typename?: 'RoleListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Role>>>;
};

export type RoleRelationshipInput = {
  create?: InputMaybe<Array<InputMaybe<RoleInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type RoleRelationships = {
  credits?: InputMaybe<CreditRelationshipInput>;
};

export type Season = CurationMetadata & Entertainment & {
  __typename?: 'Season';
  _meta?: Maybe<_SeasonMeta>;
  assets?: Maybe<AssetListing>;
  availability?: Maybe<AvailabilityListing>;
  brands?: Maybe<BrandListing>;
  credits?: Maybe<CreditListing>;
  episodes?: Maybe<EpisodeListing>;
  external_id?: Maybe<Scalars['String']>;
  genres?: Maybe<GenreListing>;
  images?: Maybe<ImageListing>;
  number_of_episodes?: Maybe<Scalars['Int']>;
  ratings?: Maybe<RatingListing>;
  season_number?: Maybe<Scalars['Int']>;
  sets?: Maybe<SetListing>;
  slug?: Maybe<Scalars['String']>;
  synopsis_long?: Maybe<Scalars['String']>;
  synopsis_medium?: Maybe<Scalars['String']>;
  synopsis_short?: Maybe<Scalars['String']>;
  tags?: Maybe<TagListing>;
  themes?: Maybe<ThemeListing>;
  title?: Maybe<Scalars['String']>;
  title_long?: Maybe<Scalars['String']>;
  title_medium?: Maybe<Scalars['String']>;
  title_short?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};


export type Season_MetaArgs = {
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
};


export type SeasonAssetsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SeasonAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SeasonBrandsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SeasonCreditsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SeasonEpisodesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SeasonGenresArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SeasonImagesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SeasonRatingsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SeasonSetsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SeasonTagsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SeasonThemesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type SeasonInput = {
  availability?: InputMaybe<AssignAvailabilityInput>;
  data_source_fields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  data_source_id?: InputMaybe<Scalars['String']>;
  external_id?: InputMaybe<Scalars['String']>;
  number_of_episodes?: InputMaybe<Scalars['Int']>;
  relationships?: InputMaybe<SeasonRelationships>;
  season_number?: InputMaybe<Scalars['Int']>;
  slug?: InputMaybe<Scalars['String']>;
  synopsis_long?: InputMaybe<Scalars['String']>;
  synopsis_medium?: InputMaybe<Scalars['String']>;
  synopsis_short?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  title_long?: InputMaybe<Scalars['String']>;
  title_medium?: InputMaybe<Scalars['String']>;
  title_short?: InputMaybe<Scalars['String']>;
};

export type SeasonListing = Listing & {
  __typename?: 'SeasonListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Season>>>;
};

export type SeasonRelationshipInput = {
  create?: InputMaybe<Array<InputMaybe<SeasonInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type SeasonRelationships = {
  assets?: InputMaybe<AssetRelationshipInput>;
  brands?: InputMaybe<BrandRelationshipInput>;
  credits?: InputMaybe<CreditRelationshipInput>;
  episodes?: InputMaybe<EpisodeRelationshipInput>;
  genres?: InputMaybe<GenreRelationshipInput>;
  images?: InputMaybe<ImageRelationshipInput>;
  ratings?: InputMaybe<RatingRelationshipInput>;
  tags?: InputMaybe<TagRelationshipInput>;
  themes?: InputMaybe<ThemeRelationshipInput>;
};

export type SeasonSetCreate = {
  object?: InputMaybe<SeasonInput>;
  position: Scalars['Int'];
};

export type SeasonSetInput = {
  create?: InputMaybe<Array<InputMaybe<SeasonSetCreate>>>;
  link?: InputMaybe<Array<InputMaybe<SetLink>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Set = CurationMetadata & Entertainment & {
  __typename?: 'Set';
  _meta?: Maybe<_SetMeta>;
  assets?: Maybe<AssetListing>;
  availability?: Maybe<AvailabilityListing>;
  content?: Maybe<CurationMetadataListing>;
  credits?: Maybe<CreditListing>;
  description?: Maybe<Scalars['String']>;
  external_id?: Maybe<Scalars['String']>;
  genres?: Maybe<GenreListing>;
  images?: Maybe<ImageListing>;
  ratings?: Maybe<RatingListing>;
  sets?: Maybe<SetListing>;
  slug?: Maybe<Scalars['String']>;
  synopsis_long?: Maybe<Scalars['String']>;
  synopsis_medium?: Maybe<Scalars['String']>;
  synopsis_short?: Maybe<Scalars['String']>;
  tags?: Maybe<TagListing>;
  themes?: Maybe<ThemeListing>;
  title?: Maybe<Scalars['String']>;
  title_long?: Maybe<Scalars['String']>;
  title_medium?: Maybe<Scalars['String']>;
  title_short?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};


export type Set_MetaArgs = {
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
};


export type SetAssetsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SetAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SetContentArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Order_Directions>;
};


export type SetCreditsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SetGenresArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SetImagesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SetRatingsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SetSetsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SetTagsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type SetThemesArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type SetContentRelationships = {
  Brand?: InputMaybe<BrandSetInput>;
  Episode?: InputMaybe<EpisodeSetInput>;
  Genre?: InputMaybe<GenreSetInput>;
  Movie?: InputMaybe<MovieSetInput>;
  Person?: InputMaybe<PersonSetInput>;
  Season?: InputMaybe<SeasonSetInput>;
  Set?: InputMaybe<SubsetInput>;
  Theme?: InputMaybe<ThemeSetInput>;
};

export type SetInput = {
  availability?: InputMaybe<AssignAvailabilityInput>;
  content?: InputMaybe<SetContentRelationships>;
  data_source_fields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  data_source_id?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  external_id?: InputMaybe<Scalars['String']>;
  relationships?: InputMaybe<SetRelationships>;
  slug?: InputMaybe<Scalars['String']>;
  synopsis_long?: InputMaybe<Scalars['String']>;
  synopsis_medium?: InputMaybe<Scalars['String']>;
  synopsis_short?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  title_long?: InputMaybe<Scalars['String']>;
  title_medium?: InputMaybe<Scalars['String']>;
  title_short?: InputMaybe<Scalars['String']>;
};

export type SetLink = {
  position: Scalars['Int'];
  uid: Scalars['String'];
};

export type SetListing = {
  __typename?: 'SetListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Set>>>;
};

export type SetRelationships = {
  assets?: InputMaybe<AssetRelationshipInput>;
  credits?: InputMaybe<CreditRelationshipInput>;
  genres?: InputMaybe<GenreRelationshipInput>;
  images?: InputMaybe<ImageRelationshipInput>;
  ratings?: InputMaybe<RatingRelationshipInput>;
  tags?: InputMaybe<TagRelationshipInput>;
  themes?: InputMaybe<ThemeRelationshipInput>;
};

export type SubsetCreate = {
  object?: InputMaybe<SetInput>;
  position: Scalars['Int'];
};

export type SubsetInput = {
  create?: InputMaybe<Array<InputMaybe<SubsetCreate>>>;
  link?: InputMaybe<Array<InputMaybe<SetLink>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Tag = Metadata & {
  __typename?: 'Tag';
  _meta?: Maybe<_TagMeta>;
  availability?: Maybe<AvailabilityListing>;
  external_id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parents?: Maybe<EntertainmentListing>;
  slug?: Maybe<Scalars['String']>;
  tag_category?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};


export type Tag_MetaArgs = {
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
};


export type TagAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type TagParentsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type TagInput = {
  availability?: InputMaybe<AssignAvailabilityInput>;
  data_source_fields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  data_source_id?: InputMaybe<Scalars['String']>;
  external_id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  tag_category?: InputMaybe<Scalars['String']>;
};

export type TagListing = Listing & {
  __typename?: 'TagListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Tag>>>;
};

export type TagRelationshipInput = {
  create?: InputMaybe<Array<InputMaybe<TagInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type TagSetCreate = {
  object?: InputMaybe<TagInput>;
  position: Scalars['Int'];
};

export type TagSetInput = {
  create?: InputMaybe<Array<InputMaybe<TagSetCreate>>>;
  link?: InputMaybe<Array<InputMaybe<SetLink>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Theme = CurationMetadata & {
  __typename?: 'Theme';
  _meta?: Maybe<_ThemeMeta>;
  availability?: Maybe<AvailabilityListing>;
  external_id?: Maybe<Scalars['String']>;
  metadata_source?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parents?: Maybe<EntertainmentListing>;
  sets?: Maybe<SetListing>;
  slug?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};


export type Theme_MetaArgs = {
  global_version?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  language_version?: InputMaybe<Scalars['Int']>;
};


export type ThemeAvailabilityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type ThemeParentsArgs = {
  language?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type ThemeSetsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  next_token?: InputMaybe<Scalars['String']>;
};

export type ThemeInput = {
  availability?: InputMaybe<AssignAvailabilityInput>;
  data_source_fields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  data_source_id?: InputMaybe<Scalars['String']>;
  external_id?: InputMaybe<Scalars['String']>;
  metadata_source?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type ThemeListing = Listing & {
  __typename?: 'ThemeListing';
  count?: Maybe<Scalars['Int']>;
  next_token?: Maybe<Scalars['String']>;
  objects?: Maybe<Array<Maybe<Theme>>>;
};

export type ThemeRelationshipInput = {
  create?: InputMaybe<Array<InputMaybe<ThemeInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ThemeSetCreate = {
  object?: InputMaybe<ThemeInput>;
  position: Scalars['Int'];
};

export type ThemeSetInput = {
  create?: InputMaybe<Array<InputMaybe<ThemeSetCreate>>>;
  link?: InputMaybe<Array<InputMaybe<SetLink>>>;
  unlink?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type UserDimension = {
  dimension: Scalars['String'];
  value: Scalars['String'];
};

export type _AssetGlobal = _Global & {
  __typename?: '_AssetGlobal';
  asset_url?: Maybe<Scalars['String']>;
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_AssetGlobal>>>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  version?: Maybe<Scalars['Int']>;
};

export type _AssetLanguage = _Language & {
  __typename?: '_AssetLanguage';
  asset_type?: Maybe<Scalars['String']>;
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_AssetLanguage>>>;
  language?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _AssetMeta = {
  __typename?: '_AssetMeta';
  available_languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<_Audit>;
  data_source?: Maybe<Asset>;
  field_config?: Maybe<Array<Maybe<_FieldConfig>>>;
  global_data?: Maybe<_AssetGlobal>;
  language_data?: Maybe<_AssetLanguage>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
};

export type _Audit = {
  __typename?: '_Audit';
  account?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
};

export type _AvailabilityMeta = {
  __typename?: '_AvailabilityMeta';
  created?: Maybe<_Audit>;
  modified?: Maybe<_Audit>;
  values?: Maybe<Array<Maybe<DimensionValue>>>;
};

export type _BrandGlobal = _Global & {
  __typename?: '_BrandGlobal';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_BrandGlobal>>>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  version?: Maybe<Scalars['Int']>;
};

export type _BrandLanguage = _Language & {
  __typename?: '_BrandLanguage';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_BrandLanguage>>>;
  language?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  slug?: Maybe<Scalars['String']>;
  synopsis_long?: Maybe<Scalars['String']>;
  synopsis_medium?: Maybe<Scalars['String']>;
  synopsis_short?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  title_long?: Maybe<Scalars['String']>;
  title_medium?: Maybe<Scalars['String']>;
  title_short?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _BrandMeta = {
  __typename?: '_BrandMeta';
  available_languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<_Audit>;
  data_source?: Maybe<Brand>;
  field_config?: Maybe<Array<Maybe<_FieldConfig>>>;
  global_data?: Maybe<_BrandGlobal>;
  language_data?: Maybe<_BrandLanguage>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
};

export type _CreditGlobal = _Global & {
  __typename?: '_CreditGlobal';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_CreditGlobal>>>;
  modified?: Maybe<_Audit>;
  position?: Maybe<Scalars['Int']>;
  publish_stage?: Maybe<PublishStage>;
  version?: Maybe<Scalars['Int']>;
};

export type _CreditLanguage = _Language & {
  __typename?: '_CreditLanguage';
  character?: Maybe<Scalars['String']>;
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_CreditLanguage>>>;
  language?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  slug?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _CreditMeta = {
  __typename?: '_CreditMeta';
  available_languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<_Audit>;
  data_source?: Maybe<Credit>;
  field_config?: Maybe<Array<Maybe<_FieldConfig>>>;
  global_data?: Maybe<_CreditGlobal>;
  language_data?: Maybe<_CreditLanguage>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
};

export type _DimensionMeta = {
  __typename?: '_DimensionMeta';
  created?: Maybe<_Audit>;
  modified?: Maybe<_Audit>;
  values?: Maybe<Array<Maybe<DimensionValue>>>;
};

export type _DimensionValueMeta = {
  __typename?: '_DimensionValueMeta';
  created?: Maybe<_Audit>;
  modified?: Maybe<_Audit>;
};

export type _EpisodeGlobal = _Global & {
  __typename?: '_EpisodeGlobal';
  created?: Maybe<_Audit>;
  episode_number?: Maybe<Scalars['Int']>;
  history?: Maybe<Array<Maybe<_EpisodeGlobal>>>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  version?: Maybe<Scalars['Int']>;
};

export type _EpisodeLanguage = _Language & {
  __typename?: '_EpisodeLanguage';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_EpisodeLanguage>>>;
  language?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  slug?: Maybe<Scalars['String']>;
  synopsis_long?: Maybe<Scalars['String']>;
  synopsis_medium?: Maybe<Scalars['String']>;
  synopsis_short?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  title_long?: Maybe<Scalars['String']>;
  title_medium?: Maybe<Scalars['String']>;
  title_short?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _EpisodeMeta = {
  __typename?: '_EpisodeMeta';
  available_languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<_Audit>;
  data_source?: Maybe<Episode>;
  field_config?: Maybe<Array<Maybe<_FieldConfig>>>;
  global_data?: Maybe<_EpisodeGlobal>;
  language_data?: Maybe<_EpisodeLanguage>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
};

export type _FieldConfig = {
  __typename?: '_FieldConfig';
  name: Scalars['String'];
  use_data_source?: Maybe<Scalars['Boolean']>;
};

export type _GenreGlobal = _Global & {
  __typename?: '_GenreGlobal';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_GenreGlobal>>>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  version?: Maybe<Scalars['Int']>;
};

export type _GenreLanguage = _Language & {
  __typename?: '_GenreLanguage';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_GenreLanguage>>>;
  language?: Maybe<Scalars['String']>;
  metadata_source?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  name?: Maybe<Scalars['String']>;
  parents?: Maybe<Array<Maybe<Metadata>>>;
  publish_stage?: Maybe<PublishStage>;
  slug?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _GenreMeta = {
  __typename?: '_GenreMeta';
  available_languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<_Audit>;
  data_source?: Maybe<Genre>;
  field_config?: Maybe<Array<Maybe<_FieldConfig>>>;
  global_data?: Maybe<_GenreGlobal>;
  language_data?: Maybe<_GenreLanguage>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
};

export type _Global = {
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_Global>>>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  version?: Maybe<Scalars['Int']>;
};

export type _ImageGlobal = _Global & {
  __typename?: '_ImageGlobal';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_ImageGlobal>>>;
  image_type?: Maybe<Scalars['String']>;
  image_url?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  version?: Maybe<Scalars['Int']>;
};

export type _ImageLanguage = _Language & {
  __typename?: '_ImageLanguage';
  created?: Maybe<_Audit>;
  description?: Maybe<Scalars['String']>;
  history?: Maybe<Array<Maybe<_ImageLanguage>>>;
  language?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _ImageMeta = {
  __typename?: '_ImageMeta';
  available_languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<_Audit>;
  data_source?: Maybe<Image>;
  field_config?: Maybe<Array<Maybe<_FieldConfig>>>;
  global_data?: Maybe<_ImageGlobal>;
  language_data?: Maybe<_ImageLanguage>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
};

export type _Language = {
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_Language>>>;
  language?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  slug?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _MovieGlobal = _Global & {
  __typename?: '_MovieGlobal';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_MovieGlobal>>>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  version?: Maybe<Scalars['Int']>;
  year_of_release?: Maybe<Scalars['Int']>;
};

export type _MovieLanguage = _Language & {
  __typename?: '_MovieLanguage';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_MovieLanguage>>>;
  language?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  slug?: Maybe<Scalars['String']>;
  synopsis_long?: Maybe<Scalars['String']>;
  synopsis_medium?: Maybe<Scalars['String']>;
  synopsis_short?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  title_long?: Maybe<Scalars['String']>;
  title_medium?: Maybe<Scalars['String']>;
  title_short?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _MovieMeta = {
  __typename?: '_MovieMeta';
  available_languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<_Audit>;
  data_source?: Maybe<Movie>;
  field_config?: Maybe<Array<Maybe<_FieldConfig>>>;
  global_data?: Maybe<_MovieGlobal>;
  language_data?: Maybe<_MovieLanguage>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
};

export type _ParentalGuidanceGlobal = _Global & {
  __typename?: '_ParentalGuidanceGlobal';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_ParentalGuidanceGlobal>>>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  version?: Maybe<Scalars['Int']>;
};

export type _ParentalGuidanceLanguage = _Language & {
  __typename?: '_ParentalGuidanceLanguage';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_ParentalGuidanceLanguage>>>;
  language?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  reason?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _ParentalGuidanceMeta = {
  __typename?: '_ParentalGuidanceMeta';
  available_languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<_Audit>;
  data_source?: Maybe<ParentalGuidance>;
  field_config?: Maybe<Array<Maybe<_FieldConfig>>>;
  global_data?: Maybe<_ParentalGuidanceGlobal>;
  language_data?: Maybe<_ParentalGuidanceLanguage>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
};

export type _PersonGlobal = _Global & {
  __typename?: '_PersonGlobal';
  created?: Maybe<_Audit>;
  date_of_birth?: Maybe<Scalars['AWSDateTime']>;
  history?: Maybe<Array<Maybe<_PersonGlobal>>>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  version?: Maybe<Scalars['Int']>;
};

export type _PersonLanguage = _Language & {
  __typename?: '_PersonLanguage';
  abbreviation?: Maybe<Scalars['String']>;
  alias?: Maybe<Scalars['String']>;
  bio_long?: Maybe<Scalars['String']>;
  bio_medium?: Maybe<Scalars['String']>;
  bio_short?: Maybe<Scalars['String']>;
  created?: Maybe<_Audit>;
  gender?: Maybe<Scalars['String']>;
  history?: Maybe<Array<Maybe<_PersonLanguage>>>;
  language?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  name?: Maybe<Scalars['String']>;
  name_sort?: Maybe<Scalars['String']>;
  place_of_birth?: Maybe<Scalars['String']>;
  publish_stage?: Maybe<PublishStage>;
  slug?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _PersonMeta = {
  __typename?: '_PersonMeta';
  available_languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<_Audit>;
  data_source?: Maybe<Person>;
  field_config?: Maybe<Array<Maybe<_FieldConfig>>>;
  global_data?: Maybe<_PersonGlobal>;
  language_data?: Maybe<_PersonLanguage>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
};

export type _RatingGlobal = _Global & {
  __typename?: '_RatingGlobal';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_RatingGlobal>>>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  scheme?: Maybe<Scalars['String']>;
  value: Scalars['String'];
  version?: Maybe<Scalars['Int']>;
};

export type _RatingLanguage = _Language & {
  __typename?: '_RatingLanguage';
  created?: Maybe<_Audit>;
  description?: Maybe<Scalars['String']>;
  history?: Maybe<Array<Maybe<_RatingLanguage>>>;
  language?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  slug?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _RatingMeta = {
  __typename?: '_RatingMeta';
  available_languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<_Audit>;
  data_source?: Maybe<Rating>;
  field_config?: Maybe<Array<Maybe<_FieldConfig>>>;
  global_data?: Maybe<_RatingGlobal>;
  language_data?: Maybe<_RatingLanguage>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
};

export type _RoleGlobal = _Global & {
  __typename?: '_RoleGlobal';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_RoleGlobal>>>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  version?: Maybe<Scalars['Int']>;
};

export type _RoleLanguage = _Language & {
  __typename?: '_RoleLanguage';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_RoleLanguage>>>;
  language?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _RoleMeta = {
  __typename?: '_RoleMeta';
  available_languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<_Audit>;
  data_source?: Maybe<Role>;
  field_config?: Maybe<Array<Maybe<_FieldConfig>>>;
  global_data?: Maybe<_RoleGlobal>;
  language_data?: Maybe<_RoleLanguage>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
};

export type _SeasonGlobal = _Global & {
  __typename?: '_SeasonGlobal';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_SeasonGlobal>>>;
  modified?: Maybe<_Audit>;
  number_of_episodes?: Maybe<Scalars['Int']>;
  publish_stage?: Maybe<PublishStage>;
  season_number?: Maybe<Scalars['Int']>;
  version?: Maybe<Scalars['Int']>;
};

export type _SeasonLanguage = _Language & {
  __typename?: '_SeasonLanguage';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_EpisodeLanguage>>>;
  language?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  slug?: Maybe<Scalars['String']>;
  synopsis_long?: Maybe<Scalars['String']>;
  synopsis_medium?: Maybe<Scalars['String']>;
  synopsis_short?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  title_long?: Maybe<Scalars['String']>;
  title_medium?: Maybe<Scalars['String']>;
  title_short?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _SeasonMeta = {
  __typename?: '_SeasonMeta';
  available_languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<_Audit>;
  data_source?: Maybe<Season>;
  field_config?: Maybe<Array<Maybe<_FieldConfig>>>;
  global_data?: Maybe<_SeasonGlobal>;
  language_data?: Maybe<_SeasonLanguage>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
};

export type _SetGlobal = _Global & {
  __typename?: '_SetGlobal';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_SetGlobal>>>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  version?: Maybe<Scalars['Int']>;
};

export type _SetLanguage = _Language & {
  __typename?: '_SetLanguage';
  created?: Maybe<_Audit>;
  description?: Maybe<Scalars['String']>;
  history?: Maybe<Array<Maybe<_SetLanguage>>>;
  language?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  slug?: Maybe<Scalars['String']>;
  synopsis_long?: Maybe<Scalars['String']>;
  synopsis_medium?: Maybe<Scalars['String']>;
  synopsis_short?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  title_long?: Maybe<Scalars['String']>;
  title_medium?: Maybe<Scalars['String']>;
  title_short?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _SetMeta = {
  __typename?: '_SetMeta';
  available_languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<_Audit>;
  data_source?: Maybe<Set>;
  field_config?: Maybe<Array<Maybe<_FieldConfig>>>;
  global_data?: Maybe<_SetGlobal>;
  language_data?: Maybe<_SetLanguage>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
};

export type _TagGlobal = _Global & {
  __typename?: '_TagGlobal';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_TagGlobal>>>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  tag_category?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _TagLanguage = _Language & {
  __typename?: '_TagLanguage';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_TagLanguage>>>;
  language?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  name?: Maybe<Scalars['String']>;
  publish_stage?: Maybe<PublishStage>;
  slug?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _TagMeta = {
  __typename?: '_TagMeta';
  available_languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<_Audit>;
  data_source?: Maybe<Tag>;
  field_config?: Maybe<Array<Maybe<_FieldConfig>>>;
  global_data?: Maybe<_TagGlobal>;
  language_data?: Maybe<_TagLanguage>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
};

export type _ThemeGlobal = _Global & {
  __typename?: '_ThemeGlobal';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_ThemeGlobal>>>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
  version?: Maybe<Scalars['Int']>;
};

export type _ThemeLanguage = _Language & {
  __typename?: '_ThemeLanguage';
  created?: Maybe<_Audit>;
  history?: Maybe<Array<Maybe<_ThemeLanguage>>>;
  language?: Maybe<Scalars['String']>;
  metadata_source?: Maybe<Scalars['String']>;
  modified?: Maybe<_Audit>;
  name?: Maybe<Scalars['String']>;
  publish_stage?: Maybe<PublishStage>;
  slug?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type _ThemeMeta = {
  __typename?: '_ThemeMeta';
  available_languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<_Audit>;
  data_source?: Maybe<Theme>;
  field_config?: Maybe<Array<Maybe<_FieldConfig>>>;
  global_data?: Maybe<_ThemeGlobal>;
  language_data?: Maybe<_ThemeLanguage>;
  modified?: Maybe<_Audit>;
  publish_stage?: Maybe<PublishStage>;
};

export enum Order_Directions {
  Asc = 'Asc',
  Desc = 'Desc'
}

/* eslint-enable */