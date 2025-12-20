import React, { FC } from "react";
import { SingleType1Props } from "../single/single";
import { getPostDataFromPostFragment } from "@/utils/getPostDataFromPostFragment";
import MyImage from "@/components/MyImage";
import SingleHeader from "../SingleHeader";

interface Props extends SingleType1Props {}

const SingleTypeAudio: FC<Props> = ({ post }) => {
  const { title, featuredImage } = getPostDataFromPostFragment(post || {});

  const renderFeaturedImage = () => {
    return (
      <div className="overflow-hidden z-10 shadow-2xl rounded-3xl">
        {featuredImage?.sourceUrl && (
          <MyImage
            className="rounded-3xl"
            alt={title}
            src={featuredImage?.sourceUrl || ""}
            width={featuredImage?.mediaDetails?.width || 1000}
            height={featuredImage?.mediaDetails?.height || 750}
            priority
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className={`relative pt-8 lg:pt-16`}>
        {/* Overlay */}
        <div className="bg-primary-50 dark:bg-neutral-800 absolute top-0 inset-x-0 h-60 w-full"></div>

        {/* SINGLE_AUDIO HEADER */}
        <header className="relative lg:container">
          <div
            className={`bg-white dark:bg-neutral-900 shadow-2xl px-4 sm:px-5 py-7 lg:p-11 rounded-2xl md:rounded-[40px] flex flex-col md:flex-row gap-8 lg:gap-10 items-start`}
          >
            <div className="sm:max-w-xs flex-shrink-0">
              {renderFeaturedImage()}
            </div>
            <SingleHeader hiddenDesc className="flex-1" post={post} />
          </div>
        </header>
      </div>
    </>
  );
};

export default SingleTypeAudio;
