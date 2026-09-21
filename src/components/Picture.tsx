import { asset } from '../site'

type PictureProps = {
  src: string
  alt: string
  className?: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
}

const imageDimensions: Record<string, [number, number]> = {
  'assets/images/generated-hero': [1054, 1492],
  'assets/images/generated-linework': [1536, 1024],
  'assets/images/generated-motion': [1536, 1024],
  'assets/images/stock-01': [1227, 1800],
  'assets/images/stock-02': [1231, 1407],
  'assets/images/stock-04': [1800, 1202],
  'assets/images/stock-05': [1202, 1800],
  'assets/images/stock-06': [1800, 1350],
  'assets/images/stock-07': [1800, 1658],
}

export function Picture({ src, alt, className, loading = 'lazy', fetchPriority = 'auto' }: PictureProps) {
  const [width, height] = imageDimensions[src] ?? [1600, 1200]
  return (
    <picture className={className}>
      <source srcSet={asset(`${src}.avif`)} type="image/avif" />
      <source srcSet={asset(`${src}.webp`)} type="image/webp" />
      <img
        src={asset(`${src}.webp`)}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
      />
    </picture>
  )
}
