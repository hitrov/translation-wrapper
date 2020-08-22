import React from "react";
import { WithReplacementProps } from "../WithReplacement";

interface ContentProps extends WithReplacementProps {
  header: string;
  content: string;
  translatedProps?: {
    header: string;
    content: string;
  }
}

export function Content(props: ContentProps) {
  const { translatedProps, header, content } = props;

  return (
    <>
      <h1>{translatedProps && translatedProps.header || header}</h1>
      <p>{translatedProps && translatedProps.content || content}</p>
    </>
  );
}
