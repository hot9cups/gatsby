import { Node, GatsbyCache, Reporter } from "gatsby"
import { fluid, fixed, traceSVG } from "gatsby-plugin-sharp"
import { SharpProps } from "./helpers"

/**
 * By default the gatsby-plugin-sharp functions don't create webP or SVG
 * images. This function adds them if needed.
 */

export async function getCustomSharpFields({
  isFixed,
  file,
  args,
  reporter,
  cache,
}: {
  isFixed: boolean
  file: Node
  args: SharpProps
  reporter: Reporter
  cache: GatsbyCache
}): Promise<{
  srcWebP?: string
  srcSetWebP?: string
  tracedSVG?: string
}> {
  const { webP, tracedSVG: createTracedSVG } = args

  let srcWebP: string | undefined
  let tracedSVG: string | undefined
  let srcSetWebP: string | undefined

  if (webP && file.extension !== `webp`) {
    // If the file is already in webp format or should explicitly
    // be converted to webp, we do not create additional webp files
    const { src, srcSet } = await (isFixed
      ? fixed({
          file,
          // TODO: need to get access to pathPrefix into these invocations
          args: { ...args, toFormat: `webp` },
          reporter,
          cache,
        })
      : fluid({
          file,
          args: { ...args, toFormat: `webp` },
          reporter,
          cache,
        }))
    srcWebP = src
    srcSetWebP = srcSet
  }

  if (createTracedSVG) {
    tracedSVG = await traceSVG({
      file,
      args: { ...args, traceSVG: true },
      fileArgs: args,
      cache,
      reporter,
    })
  }

  return { srcSetWebP, srcWebP, tracedSVG }
}
