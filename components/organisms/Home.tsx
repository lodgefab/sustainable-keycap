import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { color, font, media, zIndex } from '../../styles'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../atoms/Button'
import { CategorisedColorType, Material } from '../../types'
import { AuthContext } from '../../lib/auth'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import { MaterialItem } from '../molecules/MaterialItem'
import { useWindowSize } from '../../utils/useWindowSize'
import { Footer } from '../molecules/Footer'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import { getAuth } from 'firebase/auth'
import { useTranslation } from 'next-i18next'

type Props = {
  materials: Material[]
  setGoodCount: (materialId: string, count: number) => void
  upvotableMaterials: string[]
  upvote: Function
}

export const Home: React.VFC<Props> = ({ materials, setGoodCount, upvotableMaterials, upvote }) => {
  const authStatus = useContext(AuthContext)
  const { currentUser } = getAuth()
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  // containerRef : ヌルッとスクロールアニメーション
  // その他のRef : スクロール連動アニメーション
  const containerRef = useRef<HTMLDivElement>(null)

  const conceptImgRef = useRef<HTMLDivElement>(null)

  const size = useWindowSize()
  const data = {
    ease: 0.1,
    curr: 0,
    prev: 0,
    rounded: 0,
  }
  const setBodyHeight = () => {
    document.body.style.height = `${containerRef.current?.getBoundingClientRect().height}px`
  }

  // prev と currentのスクロール量の差分を徐々に無くしていく
  const smoothScroll = useCallback(() => {
    if (containerRef.current === null) return

    data.curr = window.scrollY
    data.prev += (data.curr - data.prev) * data.ease
    data.rounded = Math.round(data.prev * 100) / 100
    containerRef.current.style.transform = `translateY(-${data.rounded}px)`
    requestAnimationFrame(() => smoothScroll())
  }, [data])

  const setAnimation = () => {
    const animationObj = {
      duration: 0.8,
      y: -80,
      opacity: 0,
    }

    gsap.from(conceptImgRef.current, {
      scrollTrigger: {
        trigger: conceptImgRef.current!,
        start: 'bottom 90%',
        scrub: true,
        // onEnter: () => {}, //スクロールイン時
        // onEnterBack: () => {}, //スクロールバック時
        // markers: true // マーカー表示
      },
      ...animationObj,
    })
  }

  useEffect(() => {
    if (process.browser) {
      gsap.registerPlugin(ScrollTrigger)
      setAnimation()
    }
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => smoothScroll())
  })

  useEffect(() => {
    setBodyHeight()
  }, [size.height])

  const [currentFilter, setCurrentFilter] = useState<CategorisedColorType | null>(null)
  const { t } = useTranslation('translation', { keyPrefix: 'home' })

  const updateFilter = (newFilter: CategorisedColorType) => {
    setCurrentFilter(currentFilter === newFilter ? null : newFilter)
  }

  return (
    <AllWrap>
      <div ref={containerRef}>
        <Hero id='hero' color={'transparent'}>
          <VideoWrap>
            <VideoPlayer>
              <iframe
                src='https://www.youtube.com/embed/bfleByM49CM?autoplay=1&mute=1&playsinline=1&loop=1&playlist=bfleByM49CM&controls=0&disablekb=1'
                frameBorder='0'
                allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              ></iframe>
            </VideoPlayer>
            <VideoMask></VideoMask>
            <Image
              src={'/images/photos/004.jpg'}
              width={400}
              height={400}
              objectFit='cover'
              objectPosition='center center'
              layout='responsive'
            />
          </VideoWrap>
          <Title>
            プラゴミから
            <DesktopBr />
            キーキャップを
            <DesktopBr />
            作ろう
          </Title>
        </Hero>
        <ConceptSection id='concept' color={'transparent'}>
          <Wrap>
            <Message>
              #ANYCAPは、廃棄プラスチックを使ってキーキャップを自作するオープンソースコミュニティです。
              <br />
              <br />
              家庭やオフィスで出るプラゴミを原材料としたキーキャップを製作し、手法やデータを公開することを通じて、仲間の輪を広げる活動を行なっています。
            </Message>
          </Wrap>
        </ConceptSection>
        <ConceptPhotos ref={conceptImgRef}>
          <ConceptPhoto src='/images/photos/001.jpg' />
          <ConceptPhoto src='/images/photos/002.jpg' />
          <ConceptPhoto src='/images/photos/003.jpg' />
          <ConceptPhoto src='/images/photos/004.jpg' />
          <ConceptPhoto src='/images/photos/005.jpg' />
        </ConceptPhotos>
        <WHYSection id='why' color={'transparent'}>
          <WHYWrap>
            <SectionTitleGroup>
              <SectionTitle>Why #ANYCAP ?</SectionTitle>
              <SectionSubTitle>{t('whyAnycap.subtitle')}</SectionSubTitle>
            </SectionTitleGroup>
            <WhyKeys>
              <WhyKey>
                <img src='/images/icons/point001.svg' />
                <h4>一般的なキーキャップ規格に準拠</h4>
                <p>
                  Cherry,
                  DSAなど、一般的な自作キーボード規格に則ったキー形状のため、お使いのキーボードにそのまま組み込みやすいです
                </p>
              </WhyKey>
              <WhyKey>
                <img src='/images/icons/point002.svg' />
                <h4>コスト抑えめ</h4>
                <p>廃材を用いるので、原材料の費用が安く済みます</p>
              </WhyKey>
              <WhyKey>
                <img src='/images/icons/point003.svg' />
                <h4>自分の好きな色・素材にこだわれる</h4>
                <p>自分が本当にキーボードに欲しい色、欲しい素材で作ることができます</p>
              </WhyKey>
              <WhyKey>
                <img src='/images/icons/point004.svg' />
                <h4>オープンソース</h4>
                <p>金型や作り方の情報を公開しています</p>
              </WhyKey>
            </WhyKeys>
          </WHYWrap>
        </WHYSection>
        <WorkshopSection id='workshop' color={'transparent'}>
          <WorkshopWrap>
            <WorkShopImgWrap>
              <WorkShopImg src='/images/photos/006.jpg' />
            </WorkShopImgWrap>
            <WorkShopSectionTitle>
              <SectionTitle>Workshop</SectionTitle>
              <SectionSubTitle>ワークショップ</SectionSubTitle>
            </WorkShopSectionTitle>
            <WorkShopSectionContents>
              <WorkshopDesc>
                自分の好きな素材を持ち込んで、世界に１つだけの廃プラキーキャップを作るワークショップを開催しています。ご興味のある方は、下のボタンよりお申し込みください。
              </WorkshopDesc>
              <Program>
                <ProgramLabel>プログラム例：</ProgramLabel>
                <ProgramDesc>
                  10分 導入・作業説明
                  <br />
                  30分 素材の破砕作業
                  <br />
                  30分 射出成形
                  <br />
                  20分 まとめ・撮影タイム
                  <br />
                  <br />
                  場所：ガーデンテラス紀尾井町17F　ヤフーLODGE内
                </ProgramDesc>
              </Program>
              <Divider />
              <WorkshopInfo>
                <Price>
                  1200円<span>（材料費・実費）</span>
                </Price>
                <Button label={'参加する'} />
              </WorkshopInfo>
            </WorkShopSectionContents>
          </WorkshopWrap>
        </WorkshopSection>
        <MakingSection id='making' color={'transparent'}>
          <MakingWrap>
            <SectionTitleGroup>
              <SectionTitle>Making #ANYCAP</SectionTitle>
              <SectionSubTitle>廃プラキーキャップができるまで</SectionSubTitle>
            </SectionTitleGroup>
            <MakingScrollWrap>
              <MakingScrollContents>
                <MakingItem>
                  <MakingItemImg src={'/images/photos/007.jpg'} />
                  <h3>
                    <span>01.</span>素材をさがす
                  </h3>
                  <p>
                    キーキャップの素材を探します。原材料を確認でき、溶かすことで有害物質が出ないものである必要があります。ペットボトルキャップなどは身近で使いやすい素材の１つです。
                  </p>
                </MakingItem>
                <MakingItem>
                  <MakingItemImg src={'/images/photos/008.jpg'} />
                  <h3>
                    <span>02.</span>破砕する
                  </h3>
                  <p>集めた素材を砕いて、5mm角程度の大きさにします。</p>
                </MakingItem>
                <MakingItem>
                  <MakingItemImg src={'/images/photos/009.jpg'} />
                  <h3>
                    <span>03.</span>金型を用意する
                  </h3>
                  <p>
                    キーキャップの素材を探します。原材料を確認でき、溶かすことで有害物質が出ないものである必要があります。ペットボトルキャップなどは身近で使いやすい素材の１つです。
                  </p>
                </MakingItem>
                <MakingItem>
                  <MakingItemImg src={'/images/photos/010.jpg'} />
                  <h3>
                    <span>04.</span>金型を用意する
                  </h3>
                  <p>
                    キーキャップの素材を探します。原材料を確認でき、溶かすことで有害物質が出ないものである必要があります。ペットボトルキャップなどは身近で使いやすい素材の１つです。
                  </p>
                </MakingItem>
              </MakingScrollContents>
            </MakingScrollWrap>
          </MakingWrap>
        </MakingSection>
        <MoldSection id='mold' color={'transparent'}>
          <MoldWrap>
            <MoldSliderWrap>
              <MoldSlider>
                <Slider {...sliderSettings}>
                  <SlideImg src={'/images/photos/011.jpg'} />
                  <SlideImg src={'/images/photos/011.jpg'} />
                  <SlideImg src={'/images/photos/011.jpg'} />
                  <SlideImg src={'/images/photos/011.jpg'} />
                </Slider>
              </MoldSlider>
            </MoldSliderWrap>
            <MoldTitleWrap>
              <SectionTitle>Mold</SectionTitle>
              <SectionSubTitle>金型</SectionSubTitle>
            </MoldTitleWrap>
            <MoldContentsWrap>
              <MoldDesc>
                金型を用意し、家庭用の射出成形機（ORIGINALMIND社製のINARIなど）を使えば、ご自身でキーキャップを作ることも可能です。
                <br />
                より多くの方に活動に参加してもらいたいという思いから、金型の3Dデータを公開しています。
                <br />
                ご興味のある方は、下記のコンタクトフォームよりお問い合わせください
              </MoldDesc>
              <Divider />
              <Download href={'/'}>ダウンロードする</Download>
            </MoldContentsWrap>
          </MoldWrap>
        </MoldSection>
        <AboutSection id='aboutus' color={'transparent '}>
          <AboutWrap>
            <AboutTitleWrap>
              <SectionTitle>About Us</SectionTitle>
              <SectionSubTitle>わたしたちについて</SectionSubTitle>
            </AboutTitleWrap>
            <AboutContentsWrap>
              <p>
                #ANYCAPは、ヤフー社員の自主制作チームToasterによって運営されており、オープンコラボレーションハブLODGEを拠点に活動しています。
                <br />
                #ANYCAPプロジェクトは、協業いただける企業・団体・個人のみなさまをお待ちしております。
              </p>
              <AboutDivider />
              <Button label={'お問合わせ'} />
            </AboutContentsWrap>
            <AboutImageWrap>
              <Image
                src='/images/photos/012.jpg'
                alt={'Yahoo! LODGE'}
                width={495}
                height={360}
                layout='responsive'
              />
            </AboutImageWrap>
          </AboutWrap>
        </AboutSection>
        <LibrarySection id='library' color={'transparent'}>
          <LibraryWrap>
            <SectionTitleGroup>
              <SectionTitle>Library</SectionTitle>
              <SectionSubTitle>ライブラリ</SectionSubTitle>
            </SectionTitleGroup>
            <LibraryDesc>
              みんなが見つけたキーキャップに使えそうな素材とそのレポートです。実際に作ってみたものがあればどんどう投稿していってみましょう！いいねの多い人気素材は実際に販売されることがあるかも...?!
            </LibraryDesc>
            {materials.length > 0 && ( // 何らかの理由で素材リストが取れなかった時はsection全体を非表示にする
              <>
                <Filters className='filter'>
                  <Filter isSelected={currentFilter === 'red'} onClick={() => updateFilter('red')}>
                    <Palette isSelected={currentFilter === 'red'} color={color.subColor.red} />
                    Red
                  </Filter>
                  <Filter
                    isSelected={currentFilter === 'blue'}
                    onClick={() => updateFilter('blue')}
                  >
                    <Palette isSelected={currentFilter === 'blue'} color={color.subColor.blue} />
                    Blue
                  </Filter>
                  <Filter
                    isSelected={currentFilter === 'green'}
                    onClick={() => updateFilter('green')}
                  >
                    <Palette isSelected={currentFilter === 'green'} color={color.subColor.green} />
                    Green
                  </Filter>
                  <Filter
                    isSelected={currentFilter === 'black'}
                    onClick={() => updateFilter('black')}
                  >
                    <Palette isSelected={currentFilter === 'black'} color={color.subColor.dark} />
                    Black
                  </Filter>
                  <Filter
                    isSelected={currentFilter === 'white'}
                    onClick={() => updateFilter('white')}
                  >
                    <Palette isSelected={currentFilter === 'white'} color={color.content.white} />
                    White
                  </Filter>
                </Filters>
                <MaterialGrid>
                  {materials
                    .filter(
                      (material) =>
                        currentFilter === null || material.categorisedColor === currentFilter
                    )
                    .map((material) => (
                      <MaterialItem
                        key={`material-${material.id}`}
                        plasticImageUrl={material.plasticImageUrl}
                        keycapImageUrl={material.keycapImageUrl}
                        id={material.id}
                        materialName={material.materialName}
                        colorType={material.colorType}
                        celsius={material.celsius}
                        plasticType={material.plasticType}
                        goodCount={material.goodCount}
                        upvotableMaterials={upvotableMaterials}
                        upvote={upvote}
                      />
                    ))}
                </MaterialGrid>

                {/* 登録ページへのリンクはログイン中のみ有効にする */}
                {authStatus === 'LOGGED_IN' && currentUser ? (
                  <Button label={'素材を追加する'} href='/register' />
                ) : (
                  <Button label={'素材を追加する'} disabled />
                )}
              </>
            )}
          </LibraryWrap>
        </LibrarySection>
        <Footer />
      </div>
    </AllWrap>
  )
}
const AllWrap = styled.main`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
`

const Section = styled.section<{ color: string }>`
  padding: 128px 0px;
  width: 100%;
  background-color: ${(props) => `${props.color}`};
`

const Wrap = styled.div`
  max-width: 990px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  /* flex-direction: row; */
  justify-content: center;
  align-items: flex-start;
  ${media.mdsp} {
    flex-direction: column;
    padding: 0 32px;
  }
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${color.background.dark};
`
const DesktopBr = styled.br`
  ${media.md} {
    display: none;
  }
`

const SectionTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin: 0 0 64px 0;
  ${media.mdsp} {
    margin: 0 0 64px 0;
  }
`

const SectionTitle = styled.h3`
  ${font.courier.h2};
  color: ${color.content.dark};
  text-align: left;
  margin: 0 0 8px 0;
`

const SectionSubTitle = styled.p`
  ${font.inter.label};
  color: ${color.content.dark};
  text-align: left;
`

const Hero = styled(Section)`
  position: relative;
  padding: 56px 0 0px 0;
  ${media.lg} {
    height: calc(100vw * 2 / 3);
  }
  ${media.sp} {
    padding: 56px 0 0 0;
  }
`
const Title = styled.h1`
  position: absolute;
  left: calc(100vw * 2 / 3);
  top: 30%;
  ${font.inter.h1};
  font-weight: bold;
  line-height: 200%;
  ${media.mdsp} {
    position: relative;
    left: 0;
    top: 0;
    margin: 32px 0 0 32px;

    max-width: 990px;
    ${font.inter.h2};
    line-height: 150%;
  }
  ${media.md} {
    margin: 128px auto 0;
    padding: 0 32px;
    ${font.inter.h1};
  }
`

const VideoWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100vw * 2 / 3);
  height: calc(100vw * 2 / 3);
  background-color: ${color.background.white};
  overflow: hidden;
  ${media.sp} {
    position: relative;
    width: calc(100vw - 32px);
    height: calc(100vw - 32px);
  }
  ${media.md} {
    position: relative;
    width: calc(100vw - 128px);
    height: calc(100vh * 2 / 3);
  }
`

const VideoMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/mask.svg');
  background-size: cover;
  ${media.mdsp} {
    display: none;
  }
`

const VideoPlayer = styled.div`
  position: relative;
  height: 100%;
  background: #333333;
  overflow: hidden;
  ${media.mdsp} {
    display: none;
  }
  iframe {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100vw * 2 / 3);
    height: calc(100vw * 2 / 3);
    ${media.sp} {
      width: calc(100vw - 32px);
      height: calc(100vw - 32px);
    }
  }
`
const ConceptSection = styled(Section)`
  padding: 0 0 128px 0;
  ${media.mdsp} {
    padding: 32px 0px 128px 0px;
  }
`

const Message = styled.h2`
  ${font.inter.h3}
  line-height:200%;
  text-align: left;
  ${media.mdsp} {
    ${font.inter.subtitle1};
    line-height: 200%;
  }
  ${media.md} {
    ${font.inter.h3};
    line-height: 200%;
  }
`

const ConceptPhotos = styled.div`
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto;
  width: 100%;
  overflow: auto;
  padding: 0 32px;
`

const ConceptPhoto = styled.img`
  width: auto;
  height: 480px;
  ${media.mdsp} {
    width: 315px;
    height: 420px;
    object-fit: cover;
  }
`

const WHYSection = styled(Section)``
const WHYWrap = styled(Wrap)`
  flex-direction: column;
  align-items: center;
`

const WhyKeys = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, 1fr);
  gap: 64px;
  ${media.sp} {
    grid-template-rows: repeat(4, 1fr);
    grid-template-columns: repeat(1, 1fr);
  }
`

const WhyKey = styled.div`
  color: ${color.content.dark};
  width: 320px;
  img {
    width: 150px;
    height: auto;
    ${media.mdsp} {
      width: 100px;
      margin: 0 0 16px 0;
    }
  }
  h4 {
    ${font.inter.h3};
    margin: 0 0 16px 0;
    ${media.mdsp} {
      ${font.inter.subtitle1};
    }
  }
  p {
    ${font.inter.article2};
  }
`

const WorkshopSection = styled(Section)``
const WorkshopWrap = styled(Wrap)`
  display: grid;
  gap: 64px;
  grid-template-areas:
    'A B'
    'A C';
  ${media.mdsp} {
    width: 100%;
    grid-template-areas:
      'B'
      'A'
      'C';
  }
`
const WorkShopSectionTitle = styled(SectionTitleGroup)`
  grid-area: B;
  margin: 0;
  ${media.mdsp} {
    margin: 0;
  }
`

const WorkShopSectionContents = styled.div`
  grid-area: C;
`
const WorkShopImgWrap = styled.div`
  grid-area: A;
  ${media.lg} {
    width: 495px;
  }
`
const WorkShopImg = styled.img`
  width: 100%;
`
const WorkshopDesc = styled.p`
  text-align: left;
  ${font.inter.article1};
  color: ${color.content.dark};
  margin: 0 0 32px 0;
`
const Program = styled.div`
  padding: 16px;
  margin: 0 0 32px 0;
  background-color: ${color.background.blue};
  text-align: left;
  border-radius: 8px;
`
const ProgramLabel = styled.p`
  ${font.inter.subtitle2};
  margin: 0 0 8px 0;
  &:before {
    display: inline-block;
    content: '';
    background-image: url('/images/icons/triangle.svg');
    width: 12px;
    height: 12px;
    margin: 0 2px 0 0;
  }
`

const ProgramDesc = styled.p`
  ${font.inter.subtitle2};
`

const WorkshopInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  width: 100%;
`

const Price = styled.p`
  ${font.inter.h3};
  span {
    ${font.inter.label};
  }
`

const MakingSection = styled(Section)``

const MakingWrap = styled(Wrap)`
  justify-content: flex-start;
  flex-direction: column;
`

const MakingScrollWrap = styled.div`
  width: 100%;
  overflow: auto;
  padding: 0 0 64px 0;
  ::-webkit-scrollbar {
    height: 5px;
  }
  ::-webkit-scrollbar-track {
    background: ${color.content.superLight};
    border: none;
    border-radius: 0px;
    height: 5px;
    /* box-shadow: inset 0 0 2px #777;  */
  }
  ::-webkit-scrollbar-thumb {
    background: ${color.content.dark};
    border-radius: 0px;
    box-shadow: none;
  }
`

const MakingItem = styled.div`
  width: 360px;
  text-align: left;
  display: flex;
  flex-direction: column;
  h3 {
    ${font.inter.h3};
    margin: 0 0 32px 0;
  }
  p {
    ${font.inter.body2};
  }
`
const MakingItemImg = styled.img`
  width: 100%;
  height: auto;
  margin: 0 0 32px 0;
`

const MakingScrollContents = styled.div`
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(4, auto);
`

const MoldSection = styled(Section)``
const MoldWrap = styled(Wrap)`
  display: grid;
  gap: 64px;
  grid-template-areas:
    'A B'
    'A C';
  ${media.mdsp} {
    width: 100%;
    grid-template-areas:
      'B'
      'A'
      'C';
  }
`

const MoldSliderWrap = styled.div`
  grid-area: A;
  ${media.mdsp} {
    width: 100%;
    overflow: hidden;
  }
`
const MoldTitleWrap = styled(SectionTitleGroup)`
  grid-area: B;
  margin: 0px;
  ${media.mdsp} {
    margin: 0;
  }
`
const MoldContentsWrap = styled.div`
  grid-area: C;
`

const MoldDesc = styled.p`
  text-align: left;
  ${font.inter.article1};
  margin: 0 0 32px 0;
`

const MoldSlider = styled.div`
  position: relative;
  max-width: 495px;
  img {
    object-fit: cover;
  }
`

const SlideImg = styled.img`
  /* min-width:495px; */
  /* height: 360px; */
  width: 100%;
  height: 100%;
`

const Download = styled.a`
  ${font.inter.body1};
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 16px 0 0 0;
  cursor: pointer;
  &:before {
    content: '';
    display: block;
    width: 32px;
    height: 32px;
    margin: 0 16px 0 0;
    background-image: url('/images/icons/openNew.svg');
    background-size: cover;
  }
`

const AboutSection = styled(Section)``

const AboutWrap = styled(Wrap)`
  display: grid;
  gap: 64px;
  grid-template-areas:
    'B A'
    'C A';
  ${media.mdsp} {
    width: 100%;
    grid-template-areas:
      'B'
      'A'
      'C';
  }
`
const AboutTitleWrap = styled(SectionTitleGroup)`
  grid-area: B;
  margin: 0;
  ${media.mdsp} {
    margin: 0;
  }
`
const AboutContentsWrap = styled.div`
  grid-area: C;
  text-align: left;
  p {
    ${font.inter.article1};
    margin: 0 0 32px 0;
  }
  ${media.mdsp} {
    margin: 0;
  }
`
const AboutImageWrap = styled.div`
  position: relative;
  grid-area: A;
  ${media.lg} {
    min-width: 495px;
  }
  ${media.mdsp} {
    width: 100%;
  }
  &:after {
    content: '';
    display: block;
    width: 124px;
    height: 124px;
    position: absolute;
    top: -16px;
    left: -16px;
    background-image: url('/images/lodgeLogo.svg');
    background-size: cover;
    ${zIndex.default};
  }
`

const AboutDivider = styled(Divider)`
  margin: 0 0 32px 0;
`

const LibrarySection = styled(Section)``
const LibraryWrap = styled(Wrap)`
  max-width: 640px;
  flex-direction: column;
  align-items: center;
  text-align: left;
`

const Filters = styled.ul`
  display: flex;
  flex-direction: columns;
  padding: 0 0 32px 0;
  ${media.mdsp} {
    width: 100%;
    overflow: auto;
    flex-wrap: wrap;
  }
`

const Filter = styled.li<{ isSelected: boolean }>`
  display: flex;
  background-color: ${(props) => (props.isSelected ? color.primary : color.background.white)};
  color: ${(props) => (props.isSelected ? color.content.white : color.background.dark)};
  padding: 8px;
  margin: 0 16px 16px 0;
  border-radius: 4px;
  border: 2px solid ${color.primary};
  ${font.courier.subtitle2};
  cursor: pointer;
`
const Palette = styled.span<{ color: string; isSelected: boolean }>`
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 0 12px 0 0;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: ${(props) => (props.isSelected ? 1 : 0)}px solid ${color.background.white};
  &:after {
    content: '';
    display: ${(props) => (props.isSelected ? 'none' : 'block')};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid ${(props) => props.color};
  }
`
const LibraryDesc = styled.p`
  ${font.inter.article1};
  padding: 0 0 32px 0;
`

const MaterialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  width: 100%;
  margin: 0 0 32px 0;
  ${media.sp} {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
`
