import React, { useContext, useState } from 'react'
import styled from '@emotion/styled'
import { color, font, media, zIndex } from '../../styles'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../atoms/Button'
import { Material } from '../../types'
import { AuthContext } from '../../lib/auth'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'

type Props = {
  materials: Material[]
  setGoodCount: (materialId: string, count: number) => void
  upvotableMaterials: string[]
  upvote: Function
}

export const Home: React.VFC<Props> = ({ materials, setGoodCount, upvotableMaterials, upvote }) => {
  const currentUser = useContext(AuthContext)
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }
  const [currentFilter, setCurrentFilter] = useState(0)
  return (
    <>
      <main>
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
          </VideoWrap>
          <Title>
            プラゴミから
            <br />
            キーキャップを
            <br />
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
        <ConceptPhotos>
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
              <SectionSubTitle>廃プラキーキャップのススメ</SectionSubTitle>
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
            <WorkShopLeft>
              <WorkShopImg src='/images/photos/006.jpg' />
            </WorkShopLeft>
            <WorkShopRight>
              <SectionTitleGroup>
                <SectionTitle>Workshop</SectionTitle>
                <SectionSubTitle>ワークショップ</SectionSubTitle>
              </SectionTitleGroup>
              <WorkshopDesc>
                自分の好きな素材を持ち込んで、世界に１つだけの廃プラキーキャップを作るワークショップを開催しています。ご興味のある方は、下のコンタクトフォームよりご希望の人数をお知らせください
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
            </WorkShopRight>
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
          <Wrap>
            <MoldLeft>
              <MoldSlider>
                <Slider {...sliderSettings}>
                  <SlideImg src={'/images/photos/011.jpg'} />
                  <SlideImg src={'/images/photos/011.jpg'} />
                  <SlideImg src={'/images/photos/011.jpg'} />
                  <SlideImg src={'/images/photos/011.jpg'} />
                </Slider>
              </MoldSlider>
            </MoldLeft>
            <MoldRight>
              <SectionTitleGroup>
                <SectionTitle>Mold</SectionTitle>
                <SectionSubTitle>金型</SectionSubTitle>
              </SectionTitleGroup>
              <MoldDesc>
                金型を用意し、家庭用の射出成形機（ORIGINALMIND社製のINARIなど）を使えば、ご自身でキーキャップを作ることも可能です。
                <br />
                より多くの方に活動に参加してもらいたいという思いから、金型の3Dデータを公開しています。
                <br />
                ご興味のある方は、下記のコンタクトフォームよりお問い合わせください
              </MoldDesc>
              <Divider />
              <Download href={'/'}>ダウンロードする</Download>
            </MoldRight>
          </Wrap>
        </MoldSection>
        <AboutSection id='aboutus' color={'transparent '}>
          <AboutWrap>
            <AboutLeft>
              <SectionTitleGroup>
                <SectionTitle>About Us</SectionTitle>
                <SectionSubTitle>わたしたちについて</SectionSubTitle>
              </SectionTitleGroup>
              <p>
                #ANYCAPは、ヤフー社員の自主制作チームToasterによって運営されており、オープンコラボレーションハブLODGEを拠点に活動しています。
                <br />
                #ANYCAPプロジェクトは、協業いただける企業・団体・個人のみなさまをお待ちしております。
              </p>
              <AboutDivider />
              <Button label={'お問合わせ'} />
            </AboutLeft>
            <AboutRight>
              <Image src='/images/photos/012.jpg' alt={'Yahoo! LODGE'} width={495} height={360} />
            </AboutRight>
          </AboutWrap>
        </AboutSection>
        <LibrarySection id='library' color={'Peru'}>
          <LibraryWrap>
            <SectionTitleGroup>
              <SectionTitle>Library</SectionTitle>
              <SectionSubTitle>ライブラリ</SectionSubTitle>
            </SectionTitleGroup>
            <p>
              みんなが見つけたキーキャップに使えそうな素材とそのレポートです。実際に作ってみたものがあればどんどう投稿していってみましょう！いいねの多い人気素材は実際に販売されることがあるかも...?!
            </p>
            {materials.length > 0 && ( // 何らかの理由で素材リストが取れなかった時はsection全体を非表示にする
              <>
                <Filters className='filter'>
                  <Filter isSelected={currentFilter == 0 ? true : false}>
                    <Palette
                      isSelected={currentFilter == 0 ? true : false}
                      color={color.subColor.red}
                    ></Palette>
                    Red
                  </Filter>
                  <Filter isSelected={currentFilter == 1 ? true : false}>
                    <Palette
                      isSelected={currentFilter == 1 ? true : false}
                      color={color.subColor.blue}
                    ></Palette>
                    Blue
                  </Filter>
                  <Filter isSelected={currentFilter == 2 ? true : false}>
                    <Palette
                      isSelected={currentFilter == 2 ? true : false}
                      color={color.subColor.green}
                    ></Palette>
                    Green
                  </Filter>
                  <Filter isSelected={currentFilter == 3 ? true : false}>
                    <Palette
                      isSelected={currentFilter == 3 ? true : false}
                      color={color.subColor.dark}
                    ></Palette>
                    Black
                  </Filter>
                  <Filter isSelected={currentFilter == 4 ? true : false}>
                    <Palette
                      isSelected={currentFilter == 4 ? true : false}
                      color={color.content.white}
                    ></Palette>
                    White
                  </Filter>
                </Filters>

                {materials.map((material) => (
                  <div className='material' key={`material-${material.id}`}>
                    <Image
                      width={100}
                      height={50}
                      src={material.plasticImageUrl}
                      alt='素材プラスチック画像'
                    />
                    <Image
                      width={50}
                      height={50}
                      src={material.keycapImageUrl}
                      alt='キーキャップ画像'
                    />
                    <Link href={`/material/${material.id}`}>
                      <a>{material.materialName}</a>
                    </Link>
                    <p>{material.colorType}</p>
                    <p>{material.plasticType}</p>
                    {/* 既にUpvote済み、もしくは未ログインの場合はUpvoteボタンを無効化する */}
                    <button
                      onClick={() => upvote(material.id)}
                      disabled={!upvotableMaterials.includes(material.id)}
                    >
                      Upvote
                    </button>
                    <p>{material.goodCount}</p>
                  </div>
                ))}

                {/* 登録ページへのリンクはログイン中のみ有効にする */}
                {currentUser ? (
                  <Link href='/register'>
                    <a>素材を追加する</a>
                  </Link>
                ) : (
                  <a>素材を追加する</a>
                )}
              </>
            )}
          </LibraryWrap>
        </LibrarySection>
      </main>

      <footer>{/* TODO: 書く */}</footer>
    </>
  )
}

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
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${color.background.dark};
`

const SectionTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin: 0 0 64px 0;
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
  height: calc(100vw * 2 / 3);
  ${media.mdsp`
    min-height:100vh;
    `}
`
const Title = styled.h1`
  position: absolute;
  left: calc(100vw * 2 / 3);
  top: 30%;
  ${font.inter.h1};
  font-weight: bold;
  line-height: 200%;
  ${media.mdsp`
    position:relative;
    ${font.inter.h2};
  `}
`

const VideoWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100vw * 2 / 3);
  height: calc(100vw * 2 / 3);
  background-color: tomato;
`

const VideoMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/mask.svg');
  background-size: cover;
`

const VideoPlayer = styled.div`
  position: relative;
  height: 100%;
  background: #333333;
  overflow: hidden;
  iframe {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100vw * 2 / 3);
    height: calc(100vw * 2 / 3);
  }
`
const ConceptSection = styled(Section)`
  padding: 0 0 128px 0;
`

const Message = styled.h2`
  ${font.inter.h3}
  line-height:200%;
  text-align: left;
`

const ConceptPhotos = styled.div`
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto;
  width: 100%;
  overflow: auto;
`

const ConceptPhoto = styled.img`
  width: auto;
  height: 480px;
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
  ${media.sp`
    grid-template-rows:repeat(1,1fr);
    grid-template-columns:repeat(4,1fr);
  `}
`

const WhyKey = styled.div`
  color: ${color.content.dark};
  width: 320px;
  img {
    width: 150px;
    height: auto;
  }
  h4 {
    ${font.inter.h3};
    margin: 0 0 16px 0;
  }
  p {
    ${font.inter.article2};
  }
`

const WorkshopSection = styled(Section)``
const WorkshopWrap = styled(Wrap)`
  display: grid;
  gap: 64px;
  grid-template-rows: repeat(1, 1fr);
  grid-template-columns: repeat(2, 1fr);
`

const WorkShopRight = styled.div``
const WorkShopLeft = styled.div``
const WorkShopImg = styled.img`
  width: 100%;
`
const WorkshopDesc = styled.p`
  text-align: left;
  ${font.inter.article1};
  color: ${color.content.dark};
`
const Program = styled.div`
  padding: 16px;
  margin: 0 0 16px 0;
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

const MoldLeft = styled.div``

const MoldRight = styled.div`
  margin: 0 0 0 64px;
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

const AboutWrap = styled(Wrap)``
const AboutLeft = styled.div`
  text-align: left;
  margin: 0 64px 0 0;
  p {
    ${font.inter.article1};
    margin: 0 0 32px 0;
  }
`
const AboutRight = styled.div`
  position: relative;
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
`

const Filter = styled.li<{ isSelected: boolean }>`
  display: flex;
  background-color: ${(props) => (props.isSelected ? color.primary : color.background.white)};
  color: ${(props) => (props.isSelected ? color.content : color.background.white)};
  padding: 8px;
  margin: 0 16px 0 0;
  border-radius: 4px;
  border: 2px solid ${color.primary};
  ${font.courier.subtitle2};
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
