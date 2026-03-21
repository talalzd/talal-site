vimport { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Talal Al Zayed';
  const tag = searchParams.get('tag') || 'POLICY × TECHNOLOGY × BUILDER';
  const excerpt = searchParams.get('excerpt') || '';

  // Adjust title font size based on length
  const titleSize = title.length > 80 ? 44 : title.length > 60 ? 48 : 54;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 90px',
          backgroundColor: '#0A0A0A',
          position: 'relative',
        }}
      >
        {/* Accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 80,
            width: 1,
            height: '100%',
            background: 'linear-gradient(to bottom, transparent, rgba(200,169,126,0.2) 30%, rgba(200,169,126,0.2) 70%, transparent)',
          }}
        />
        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(to right, #C8A97E, rgba(200,169,126,0.3))',
          }}
        />

        <div
          style={{
            fontSize: 12,
            fontWeight: 300,
            letterSpacing: 5,
            textTransform: 'uppercase',
            color: '#C8A97E',
            marginBottom: 28,
            fontFamily: 'monospace',
          }}
        >
          {tag}
        </div>

        <div
          style={{
            fontSize: titleSize,
            lineHeight: 1.12,
            color: '#E8E4DF',
            maxWidth: 950,
            marginBottom: 32,
            fontFamily: 'serif',
          }}
        >
          {title}
        </div>

        {excerpt && (
          <div
            style={{
              fontSize: 17,
              fontWeight: 300,
              color: '#8A8580',
              maxWidth: 750,
              lineHeight: 1.6,
            }}
          >
            {excerpt}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginTop: 'auto',
          }}
        >
          <div style={{ fontSize: 20, color: '#E8E4DF', fontFamily: 'serif' }}>
            Talal Al Zayed
          </div>
          <div
            style={{
              width: 1,
              height: 20,
              background: 'rgba(200,169,126,0.3)',
            }}
          />
          <div
            style={{
              fontSize: 13,
              letterSpacing: 1,
              color: '#6B6560',
              fontFamily: 'monospace',
            }}
          >
            talalalzayed.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
