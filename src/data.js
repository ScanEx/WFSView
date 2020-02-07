const WFS = `<?xml version="1.0" encoding="UTF-8"?>
<WFS_Capabilities xmlns="http://www.opengis.net/wfs" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-capabilities.xsd">
   <Service>
      <Name>Geomixer WFS</Name>
      <Title>wfs test</Title>
      <OnlineResource>http://maps.kosmosnimki.ru/rest/ver1/service/wfs/apikeyNO736AVVYH/map7C3D19B5D72D41F883519ED0F8472062</OnlineResource>
      <Fees>NONE</Fees>
      <AccessConstraints>NONE</AccessConstraints>
   </Service>
   <Capability>
      <Request>
         <GetCapabilities>
            <DCPType>
               <HTTP>
                  <Get onlineResource="http://maps.kosmosnimki.ru/rest/ver1/service/wfs/apikeyNO736AVVYH/map7C3D19B5D72D41F883519ED0F8472062" />
               </HTTP>
            </DCPType>
         </GetCapabilities>
         <DescribeFeatureType>
            <DCPType>
               <HTTP>
                  <Get onlineResource="http://maps.kosmosnimki.ru/rest/ver1/service/wfs/apikeyNO736AVVYH/map7C3D19B5D72D41F883519ED0F8472062" />
               </HTTP>
            </DCPType>
            <DCPType>
               <HTTP>
                  <Post onlineResource="http://maps.kosmosnimki.ru/rest/ver1/service/wfs/apikeyNO736AVVYH/map7C3D19B5D72D41F883519ED0F8472062" />
               </HTTP>
            </DCPType>
         </DescribeFeatureType>
         <GetFeature>
            <ResultFormat>
               <GML2 />
               <GML3 />
            </ResultFormat>
            <DCPType>
               <HTTP>
                  <Get onlineResource="http://maps.kosmosnimki.ru/rest/ver1/service/wfs/apikeyNO736AVVYH/map7C3D19B5D72D41F883519ED0F8472062" />
               </HTTP>
            </DCPType>
            <DCPType>
               <HTTP>
                  <Post onlineResource="http://maps.kosmosnimki.ru/rest/ver1/service/wfs/apikeyNO736AVVYH/map7C3D19B5D72D41F883519ED0F8472062" />
               </HTTP>
            </DCPType>
         </GetFeature>
      </Request>
   </Capability>
   <FeatureTypeList>
      <Operations>
         <Query />
      </Operations>
      <FeatureType>
         <Name>gmx:L82FFA76FFEB5464784BE16C8FB28BD18</Name>
         <Title>Граница Объекта работ</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.840417459607" miny="43.0575944656023" maxx="132.099538967013" maxy="43.3190456298727" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L73861952BE484150B445E87447D84277</Name>
         <Title>Здания</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.89572930336" miny="43.0859932810146" maxx="131.969584599137" maxy="43.1958806571918" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:LFBE2620674464BB1B389662904008A2F</Name>
         <Title>Земельные участки</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.851147636771" miny="43.0723377658379" maxx="132.076463252306" maxy="43.3126572975467" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:LB4E1BB9A85F845F69601422FAE94FA3D</Name>
         <Title>Имущественные комплексы площадью более 0.4 га, не принадлежащие силовым структурам и не находящиеся в работе у ДОМ.РФ</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.854935586452" miny="43.0715172898923" maxx="132.040819376707" maxy="43.2751929590196" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L4B390BB88946477CB9D64E70F40236E1</Name>
         <Title>Здания</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.895572394133" miny="43.0857822096278" maxx="131.969660371542" maxy="43.1960165558272" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:LCF498DC8632E4053BEBA92AB83EECCEE</Name>
         <Title>Земельные участки</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.85092702508" miny="43.0715172898923" maxx="132.077159956098" maxy="43.3128861259955" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L2D7A2F562C974783A4BC3CD163C95759</Name>
         <Title>Объекты незавершенного строительства</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.841806173325" miny="43.075955076572" maxx="132.078975811601" maxy="43.2959992978335" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:LBAB16FD8F73646FDA8600F36A60DDD6D</Name>
         <Title>Сооружения</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.846797764301" miny="43.0677929257725" maxx="132.093275338411" maxy="43.3148811417896" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L7A727C3FA23B4F268B76EB5E15004E62</Name>
         <Title>Здания</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.841578856111" miny="43.0675347640395" maxx="132.09771104157" maxy="43.3167263145304" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:LCA3A3062193A4A37861F21B5564C4809</Name>
         <Title>Земельные участки</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.838118135929" miny="43.033091535723" maxx="132.204807624221" maxy="43.318842681118" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:LCB3304A8A71A4659B800D5AF2B4BF6EA</Name>
         <Title>Особо охраняемые природные территории</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.977702304721" miny="43.089487361753" maxx="131.981696784496" maxy="43.091114600002" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L6AE343C23C4E45B8848CD46D89122FCD</Name>
         <Title>Поверхностные водные объекты (линенйная геометрия)</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.900871768594" miny="43.0918138633443" maxx="132.111208587885" maxy="43.3153285354606" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L8377EEE131364871B8F3CDD27CAB156E</Name>
         <Title>Поверхностные водные объекты (полигональная геометрия)</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.77905857563" miny="43.0126225395446" maxx="132.08877325058" maxy="43.3315500633023" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L54B36ECD7DC2489CBFE856A34DCFDF3A</Name>
         <Title>Береговые полосы водных объектов общего пользования</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.840499937534" miny="43.0574832466413" maxx="132.111455351114" maxy="43.3317300451312" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:LE7877E57502A4E62B776EEC15E492418</Name>
         <Title>Объекты незавершенного строительства</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.841806173325" miny="43.075955076572" maxx="132.078975811601" maxy="43.2959992978335" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L0E9AB0D43B1D4D6D8C5910FCBDA492C7</Name>
         <Title>Сооружения</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.846797764301" miny="43.0677929257725" maxx="132.093275338411" maxy="43.3148811417896" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:LE17C4FD193AF42EA91DE9CCA2216A9D6</Name>
         <Title>Здания</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.841578856111" miny="43.0675347640395" maxx="132.09771104157" maxy="43.3167263145304" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L508F0CBEE37A4C25B1CBC23A3379A34D</Name>
         <Title>Земельные участки</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.838118135929" miny="43.033091535723" maxx="132.204807624221" maxy="43.318842681118" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:LCD3E95079D1D425CB5AC212D9AB185BF</Name>
         <Title>Локализованные объекты недвижимости, не являющиеся федеральными</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.841298565269" miny="43.0585248753512" maxx="132.097676172852" maxy="43.3167424144162" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:LD018530AA83247D8ACFE08024F39D9BE</Name>
         <Title>Объекты незавершенного строительства</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.841806173325" miny="43.075955076572" maxx="132.078975811601" maxy="43.2959992978335" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L34D6CBA286F34CF1B12338BA8974FC18</Name>
         <Title>Сооружения</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.846797764301" miny="43.0677929257725" maxx="132.093275338411" maxy="43.3148811417896" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L86CB81E6643A462CB0D1916DE46168BE</Name>
         <Title>Здания</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.841578856111" miny="43.0675347640395" maxx="132.09771104157" maxy="43.3167263145304" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L67806561BA814C32B2C57A67EF6887BA</Name>
         <Title>Земельные участки</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.838118135929" miny="43.033091535723" maxx="132.204807624221" maxy="43.318842681118" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L47FE490E772D46378DF2F5459C44EA5F</Name>
         <Title>Объекты незавершенного строительства</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.848367527127" miny="43.0805806127954" maxx="132.09255181253" maxy="43.3073222766865" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:LC739DF5399184ECDAD5B2E9D4DC6B1FC</Name>
         <Title>Сооружения</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.848367527127" miny="43.0805806127954" maxx="132.094053849578" maxy="43.3073222766865" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L92A0A6307607420887C3D834C0873A80</Name>
         <Title>Здания</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.848367527127" miny="43.0805806127954" maxx="132.094053849578" maxy="43.3073222766865" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L9AA28208BEE64A09B0353DE9E524DE3A</Name>
         <Title>Земельные участки</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.848367527127" miny="43.0805806127954" maxx="132.094053849578" maxy="43.3073222766865" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:LB5FBE294EE634DCDAB6134ED4C71A45F</Name>
         <Title>Объекты незавершенного строительства</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.841806173325" miny="43.075955076572" maxx="132.078975811601" maxy="43.2959992978335" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L4D22650120224F9E8D14544B530628E1</Name>
         <Title>Сооружения</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.846797764301" miny="43.0677929257725" maxx="132.093275338411" maxy="43.3148811417896" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L59EFF83908F4495BBB0C4698005DA25F</Name>
         <Title>Здания</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.841578856111" miny="43.0675347640395" maxx="132.09771104157" maxy="43.3167263145304" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L452EE4C31E0144779C3E57E9380B75E9</Name>
         <Title>Земельные участки</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.838118135929" miny="43.033091535723" maxx="132.204807624221" maxy="43.318842681118" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L6DCDF1DE3472444D98AF8102D3BFAA3C</Name>
         <Title>Кадастровые кварталы</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.840417459607" miny="43.0575944656023" maxx="132.099538967013" maxy="43.3190456298727" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:L5C250D87930B4498964CBF0B62C91D79</Name>
         <Title>Даты сцен покрытия 2018-2019гг</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.839999035001" miny="43.0563641864862" maxx="132.104816883802" maxy="43.3210575178768" />
      </FeatureType>
      <FeatureType>
         <Name>gmx:LCD3E7B4713394B9FB52B530D7AB356B2</Name>
         <Title>Даты сцен покрытия 2015-2017гг</Title>
         <Abstract />
         <SRS>EPSG:4326</SRS>
         <SRS>EPSG:3395</SRS>
         <SRS>EPSG:3857</SRS>
         <LatLongBoundingBox minx="131.830702498555" miny="43.0511331423584" maxx="132.102037444711" maxy="43.3214868161008" />
      </FeatureType>
   </FeatureTypeList>
   <ogc:Filter_Capabilities>
      <ogc:Spatial_Capabilities>
         <ogc:Spatial_Operators>
            <ogc:BBOX />
            <ogc:Intersect />
            <ogc:Within />
            <ogc:Contains />
         </ogc:Spatial_Operators>
      </ogc:Spatial_Capabilities>
      <ogc:Scalar_Capabilities>
         <ogc:Logical_Operators />
         <ogc:Comparison_Operators>
            <ogc:Simple_Comparisons />
            <ogc:NullCheck />
         </ogc:Comparison_Operators>
         <ogc:Arithmetic_Operators>
            <ogc:Simple_Arithmetic />
         </ogc:Arithmetic_Operators>
      </ogc:Scalar_Capabilities>
   </ogc:Filter_Capabilities>
</WFS_Capabilities>`;

const WMS = `<?xml version="1.0" encoding="utf-8"?>
<WMS_Capabilities
  version="1.3.0"
  xsi:schemaLocation="http://www.opengis.net/wms http://schemas.opengis.net/wms/1.3.0/capabilities_1_3_0.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wms">
  <Service>
    <Name>WMS</Name>
    <Title>Геопортал мониторинга и анализа федеральных земель, город Владивосток</Title>
    <MaxWidth>2048</MaxWidth>
    <MaxHeight>2048</MaxHeight>
  </Service>
  <Capability>
    <Request>
      <GetCapabilities>
        <Format>text/xml</Format>
        <DCPType>
          <HTTP>
            <Get>
              <OnlineResource
                xlink:type="simple"
                xlink:href="http://maps.kosmosnimki.ru/rest/ver1/service/wms/apikeyNO736AVVYH/map7C3D19B5D72D41F883519ED0F8472062?" xmlns:xlink="http://www.w3.org/1999/xlink" />
            </Get>
            <Post>
              <OnlineResource
                xlink:type="simple"
                xlink:href="http://maps.kosmosnimki.ru/rest/ver1/service/wms/apikeyNO736AVVYH/map7C3D19B5D72D41F883519ED0F8472062?" xmlns:xlink="http://www.w3.org/1999/xlink" />
            </Post>
          </HTTP>
        </DCPType>
      </GetCapabilities>
      <GetMap>
        <Format>image/jpeg</Format>
        <Format>image/png</Format>
        <Format>image/png; mode=24bit</Format>
        <DCPType>
          <HTTP>
            <Get>
              <OnlineResource
                xlink:type="simple"
                xlink:href="http://maps.kosmosnimki.ru/rest/ver1/service/wms/apikeyNO736AVVYH/map7C3D19B5D72D41F883519ED0F8472062?" xmlns:xlink="http://www.w3.org/1999/xlink" />
            </Get>
            <Post>
              <OnlineResource
                xlink:type="simple"
                xlink:href="http://maps.kosmosnimki.ru/rest/ver1/service/wms/apikeyNO736AVVYH/map7C3D19B5D72D41F883519ED0F8472062?" xmlns:xlink="http://www.w3.org/1999/xlink" />
            </Post>
          </HTTP>
        </DCPType>
      </GetMap>
      <GetFeatureInfo>
        <Format>text/html</Format>
        <DCPType>
          <HTTP>
            <Get>
              <OnlineResource
                xlink:type="simple"
                xlink:href="http://maps.kosmosnimki.ru/rest/ver1/service/wms/apikeyNO736AVVYH/map7C3D19B5D72D41F883519ED0F8472062?" xmlns:xlink="http://www.w3.org/1999/xlink" />
            </Get>
            <Post>
              <OnlineResource
                xlink:type="simple"
                xlink:href="http://maps.kosmosnimki.ru/rest/ver1/service/wms/apikeyNO736AVVYH/map7C3D19B5D72D41F883519ED0F8472062?" xmlns:xlink="http://www.w3.org/1999/xlink" />
            </Post>
          </HTTP>
        </DCPType>
      </GetFeatureInfo>
    </Request>
    <Exception>
      <Format>XML</Format>
      <Format>BLANK</Format>
    </Exception>
    <Layer>
      <Title>Геопортал мониторинга и анализа федеральных земель, город Владивосток</Title>
      <Layer
        queryable="1">
        <Name>7C3D19B5D72D41F883519ED0F8472062.82FFA76FFEB5464784BE16C8FB28BD18</Name>
        <Title>Граница Объекта работ</Title>
        <Abstract />
        <CRS>EPSG:3395</CRS>
        <CRS>EPSG:4326</CRS>
        <CRS>EPSG:3857</CRS>
        <CRS>EPSG:900913</CRS>
        <EX_GeographicBoundingBox>
          <westBoundLongitude>131.840417459607</westBoundLongitude>
          <eastBoundLongitude>132.099538967013</eastBoundLongitude>
          <southBoundLatitude>43.0575944656023</southBoundLatitude>
          <northBoundLatitude>43.3190456298727</northBoundLatitude>
        </EX_GeographicBoundingBox>
        <BoundingBox
          CRS="EPSG:3395"
          minx="14676408.1375761"
          miny="5291560.9286409"
          maxx="14705253.4118341"
          maxy="5331336.61742457" />
        <BoundingBox
          CRS="EPSG:4326"
          minx="43.0575944656023"
          miny="131.840417459607"
          maxx="43.3190456298727"
          maxy="132.099538967013" />
        <BoundingBox
          CRS="EPSG:3857"
          minx="14676408.1375761"
          miny="5320742.42467053"
          maxx="14705253.4118341"
          maxy="5360660.61765497" />
        <BoundingBox
          CRS="EPSG:900913"
          minx="14676408.1375761"
          miny="5320742.42467053"
          maxx="14705253.4118341"
          maxy="5360660.61765497" />
      </Layer>
      <Layer>
        <Title>Результаты фотофиксации</Title>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.73861952BE484150B445E87447D84277</Name>
          <Title>Здания</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.89572930336</westBoundLongitude>
            <eastBoundLongitude>131.969584599137</eastBoundLongitude>
            <southBoundLatitude>43.0859932810146</southBoundLatitude>
            <northBoundLatitude>43.1958806571918</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14682565.4238575"
            miny="5295873.07008254"
            maxx="14690786.9577758"
            maxy="5312577.62119272" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0859932810146"
            miny="131.89572930336"
            maxx="43.1958806571918"
            maxy="131.969584599137" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14682565.4238575"
            miny="5325070.0742329"
            maxx="14690786.9577758"
            maxy="5341834.56574512" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14682565.4238575"
            miny="5325070.0742329"
            maxx="14690786.9577758"
            maxy="5341834.56574512" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.FBE2620674464BB1B389662904008A2F</Name>
          <Title>Земельные участки</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.851147636771</westBoundLongitude>
            <eastBoundLongitude>132.076463252306</eastBoundLongitude>
            <southBoundLatitude>43.0723377658379</southBoundLatitude>
            <northBoundLatitude>43.3126572975467</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14677602.6154341"
            miny="5293799.33406828"
            maxx="14702684.6350232"
            maxy="5330362.6835213" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0723377658379"
            miny="131.851147636771"
            maxx="43.3126572975467"
            maxy="132.076463252306" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14677602.6154341"
            miny="5322988.88205944"
            maxx="14702684.6350232"
            maxy="5359683.20901398" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14677602.6154341"
            miny="5322988.88205944"
            maxx="14702684.6350232"
            maxy="5359683.20901398" />
        </Layer>
      </Layer>
      <Layer>
        <Title>Результаты дешифрирования</Title>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.B4E1BB9A85F845F69601422FAE94FA3D</Name>
          <Title>Имущественные комплексы площадью более 0.4 га, не принадлежащие силовым структурам и не находящиеся в работе у ДОМ.РФ</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.854935586452</westBoundLongitude>
            <eastBoundLongitude>132.040819376707</eastBoundLongitude>
            <southBoundLatitude>43.0715172898923</southBoundLatitude>
            <northBoundLatitude>43.2751929590196</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14678024.2880638"
            miny="5293674.75084373"
            maxx="14698716.7769416"
            maxy="5324653.12780834" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0715172898923"
            miny="131.854935586452"
            maxx="43.2751929590196"
            maxy="132.040819376707" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14678024.2880638"
            miny="5322863.85078759"
            maxx="14698716.7769416"
            maxy="5353953.26842295" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14678024.2880638"
            miny="5322863.85078759"
            maxx="14698716.7769416"
            maxy="5353953.26842295" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.4B390BB88946477CB9D64E70F40236E1</Name>
          <Title>Здания</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.895572394133</westBoundLongitude>
            <eastBoundLongitude>131.969660371542</eastBoundLongitude>
            <southBoundLatitude>43.0857822096278</southBoundLatitude>
            <northBoundLatitude>43.1960165558272</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14682547.9568022"
            miny="5295841.01309303"
            maxx="14690795.3927213"
            maxy="5312598.29858902" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0857822096278"
            miny="131.895572394133"
            maxx="43.1960165558272"
            maxy="131.969660371542" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14682547.9568022"
            miny="5325037.90200712"
            maxx="14690795.3927213"
            maxy="5341855.31720397" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14682547.9568022"
            miny="5325037.90200712"
            maxx="14690795.3927213"
            maxy="5341855.31720397" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.CF498DC8632E4053BEBA92AB83EECCEE</Name>
          <Title>Земельные участки</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.85092702508</westBoundLongitude>
            <eastBoundLongitude>132.077159956098</eastBoundLongitude>
            <southBoundLatitude>43.0715172898923</southBoundLatitude>
            <northBoundLatitude>43.3128861259955</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14677578.057053"
            miny="5293674.75084373"
            maxx="14702762.1917345"
            maxy="5330397.56780693" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0715172898923"
            miny="131.85092702508"
            maxx="43.3128861259955"
            maxy="132.077159956098" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14677578.057053"
            miny="5322863.85078759"
            maxx="14702762.1917345"
            maxy="5359718.21777011" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14677578.057053"
            miny="5322863.85078759"
            maxx="14702762.1917345"
            maxy="5359718.21777011" />
        </Layer>
      </Layer>
      <Layer>
        <Title>Результаты анализа по ограничениям в обороте федеральных объектов недвижимости</Title>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.2D7A2F562C974783A4BC3CD163C95759</Name>
          <Title>Объекты незавершенного строительства</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.841806173325</westBoundLongitude>
            <eastBoundLongitude>132.078975811601</eastBoundLongitude>
            <southBoundLatitude>43.075955076572</southBoundLatitude>
            <northBoundLatitude>43.2959992978335</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14676562.72848"
            miny="5294348.61606951"
            maxx="14702964.3318445"
            maxy="5327823.57119262" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.075955076572"
            miny="131.841806173325"
            maxx="43.2959992978335"
            maxy="132.078975811601" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14676562.72848"
            miny="5323540.13933863"
            maxx="14702964.3318445"
            maxy="5357135.03437085" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14676562.72848"
            miny="5323540.13933863"
            maxx="14702964.3318445"
            maxy="5357135.03437085" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.BAB16FD8F73646FDA8600F36A60DDD6D</Name>
          <Title>Сооружения</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.846797764301</westBoundLongitude>
            <eastBoundLongitude>132.093275338411</eastBoundLongitude>
            <southBoundLatitude>43.0677929257725</southBoundLatitude>
            <northBoundLatitude>43.3148811417896</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14677118.3898457"
            miny="5293109.2547216"
            maxx="14704556.1478876"
            maxy="5330701.70823869" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0677929257725"
            miny="131.846797764301"
            maxx="43.3148811417896"
            maxy="132.093275338411" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14677118.3898457"
            miny="5322296.32078168"
            maxx="14704556.1478876"
            maxy="5360023.44336449" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14677118.3898457"
            miny="5322296.32078168"
            maxx="14704556.1478876"
            maxy="5360023.44336449" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.7A727C3FA23B4F268B76EB5E15004E62</Name>
          <Title>Здания</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.841578856111</westBoundLongitude>
            <eastBoundLongitude>132.09771104157</eastBoundLongitude>
            <southBoundLatitude>43.0675347640395</southBoundLatitude>
            <northBoundLatitude>43.3167263145304</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14676537.4236435"
            miny="5293070.05751169"
            maxx="14705049.9281045"
            maxy="5330983.01402772" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0675347640395"
            miny="131.841578856111"
            maxx="43.3167263145304"
            maxy="132.09771104157" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14676537.4236435"
            miny="5322256.9825845"
            maxx="14705049.9281045"
            maxy="5360305.75277951" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14676537.4236435"
            miny="5322256.9825845"
            maxx="14705049.9281045"
            maxy="5360305.75277951" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.CA3A3062193A4A37861F21B5564C4809</Name>
          <Title>Земельные участки</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.838118135929</westBoundLongitude>
            <eastBoundLongitude>132.204807624221</eastBoundLongitude>
            <southBoundLatitude>43.033091535723</southBoundLatitude>
            <northBoundLatitude>43.318842681118</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14676152.1780351"
            miny="5287841.96359812"
            maxx="14716971.865151"
            maxy="5331305.67526401" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.033091535723"
            miny="131.838118135929"
            maxx="43.318842681118"
            maxy="132.204807624221" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14676152.1780351"
            miny="5317010.07325326"
            maxx="14716971.865151"
            maxy="5360629.56511223" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14676152.1780351"
            miny="5317010.07325326"
            maxx="14716971.865151"
            maxy="5360629.56511223" />
        </Layer>
      </Layer>
      <Layer>
        <Title>Ограничения в обороте объектов недвижимости</Title>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.CB3304A8A71A4659B800D5AF2B4BF6EA</Name>
          <Title>Особо охраняемые природные территории</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.977702304721</westBoundLongitude>
            <eastBoundLongitude>131.981696784496</eastBoundLongitude>
            <southBoundLatitude>43.089487361753</southBoundLatitude>
            <northBoundLatitude>43.091114600002</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14691690.6166278"
            miny="5296403.75841145"
            maxx="14692135.2800824"
            maxy="5296650.91718441" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.089487361753"
            miny="131.977702304721"
            maxx="43.091114600002"
            maxy="131.981696784496" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14691690.6166278"
            miny="5325602.67012822"
            maxx="14692135.2800824"
            maxy="5325850.71724247" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14691690.6166278"
            miny="5325602.67012822"
            maxx="14692135.2800824"
            maxy="5325850.71724247" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.6AE343C23C4E45B8848CD46D89122FCD</Name>
          <Title>Поверхностные водные объекты (линенйная геометрия)</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.900871768594</westBoundLongitude>
            <eastBoundLongitude>132.111208587885</eastBoundLongitude>
            <southBoundLatitude>43.0918138633443</southBoundLatitude>
            <northBoundLatitude>43.3153285354606</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14683137.8804687"
            miny="5296757.12927462"
            maxx="14706552.4680873"
            maxy="5330769.91484563" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0918138633443"
            miny="131.900871768594"
            maxx="43.3153285354606"
            maxy="132.111208587885" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14683137.8804687"
            miny="5325957.31106707"
            maxx="14706552.4680873"
            maxy="5360091.89332049" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14683137.8804687"
            miny="5325957.31106707"
            maxx="14706552.4680873"
            maxy="5360091.89332049" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.8377EEE131364871B8F3CDD27CAB156E</Name>
          <Title>Поверхностные водные объекты (полигональная геометрия)</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.77905857563</westBoundLongitude>
            <eastBoundLongitude>132.08877325058</eastBoundLongitude>
            <southBoundLatitude>43.0126225395446</southBoundLatitude>
            <northBoundLatitude>43.3315500633023</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14669577.6978561"
            miny="5284736.40054704"
            maxx="14704054.9777627"
            maxy="5333243.28072621" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0126225395446"
            miny="131.77905857563"
            maxx="43.3315500633023"
            maxy="132.08877325058" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14669577.6978561"
            miny="5313893.32356671"
            maxx="14704054.9777627"
            maxy="5362574.08131031" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14669577.6978561"
            miny="5313893.32356671"
            maxx="14704054.9777627"
            maxy="5362574.08131031" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.54B36ECD7DC2489CBFE856A34DCFDF3A</Name>
          <Title>Береговые полосы водных объектов общего пользования</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.840499937534</westBoundLongitude>
            <eastBoundLongitude>132.111455351114</eastBoundLongitude>
            <southBoundLatitude>43.0574832466413</southBoundLatitude>
            <northBoundLatitude>43.3317300451312</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14676417.3189769"
            miny="5291544.04485321"
            maxx="14706579.9376443"
            maxy="5333270.72705844" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0574832466413"
            miny="131.840499937534"
            maxx="43.3317300451312"
            maxy="132.111455351114" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14676417.3189769"
            miny="5320725.48013399"
            maxx="14706579.9376443"
            maxy="5362601.62551288" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14676417.3189769"
            miny="5320725.48013399"
            maxx="14706579.9376443"
            maxy="5362601.62551288" />
        </Layer>
      </Layer>
      <Layer>
        <Title>Локализованные федеральные объекты недвижимости, не вынесенные в границы согласно ЕГРН</Title>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.E7877E57502A4E62B776EEC15E492418</Name>
          <Title>Объекты незавершенного строительства</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.841806173325</westBoundLongitude>
            <eastBoundLongitude>132.078975811601</eastBoundLongitude>
            <southBoundLatitude>43.075955076572</southBoundLatitude>
            <northBoundLatitude>43.2959992978335</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14676562.72848"
            miny="5294348.61606951"
            maxx="14702964.3318445"
            maxy="5327823.57119262" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.075955076572"
            miny="131.841806173325"
            maxx="43.2959992978335"
            maxy="132.078975811601" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14676562.72848"
            miny="5323540.13933863"
            maxx="14702964.3318445"
            maxy="5357135.03437085" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14676562.72848"
            miny="5323540.13933863"
            maxx="14702964.3318445"
            maxy="5357135.03437085" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.0E9AB0D43B1D4D6D8C5910FCBDA492C7</Name>
          <Title>Сооружения</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.846797764301</westBoundLongitude>
            <eastBoundLongitude>132.093275338411</eastBoundLongitude>
            <southBoundLatitude>43.0677929257725</southBoundLatitude>
            <northBoundLatitude>43.3148811417896</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14677118.3898457"
            miny="5293109.2547216"
            maxx="14704556.1478876"
            maxy="5330701.70823869" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0677929257725"
            miny="131.846797764301"
            maxx="43.3148811417896"
            maxy="132.093275338411" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14677118.3898457"
            miny="5322296.32078168"
            maxx="14704556.1478876"
            maxy="5360023.44336449" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14677118.3898457"
            miny="5322296.32078168"
            maxx="14704556.1478876"
            maxy="5360023.44336449" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.E17C4FD193AF42EA91DE9CCA2216A9D6</Name>
          <Title>Здания</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.841578856111</westBoundLongitude>
            <eastBoundLongitude>132.09771104157</eastBoundLongitude>
            <southBoundLatitude>43.0675347640395</southBoundLatitude>
            <northBoundLatitude>43.3167263145304</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14676537.4236435"
            miny="5293070.05751169"
            maxx="14705049.9281045"
            maxy="5330983.01402772" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0675347640395"
            miny="131.841578856111"
            maxx="43.3167263145304"
            maxy="132.09771104157" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14676537.4236435"
            miny="5322256.9825845"
            maxx="14705049.9281045"
            maxy="5360305.75277951" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14676537.4236435"
            miny="5322256.9825845"
            maxx="14705049.9281045"
            maxy="5360305.75277951" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.508F0CBEE37A4C25B1CBC23A3379A34D</Name>
          <Title>Земельные участки</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.838118135929</westBoundLongitude>
            <eastBoundLongitude>132.204807624221</eastBoundLongitude>
            <southBoundLatitude>43.033091535723</southBoundLatitude>
            <northBoundLatitude>43.318842681118</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14676152.1780351"
            miny="5287841.96359812"
            maxx="14716971.865151"
            maxy="5331305.67526401" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.033091535723"
            miny="131.838118135929"
            maxx="43.318842681118"
            maxy="132.204807624221" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14676152.1780351"
            miny="5317010.07325326"
            maxx="14716971.865151"
            maxy="5360629.56511223" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14676152.1780351"
            miny="5317010.07325326"
            maxx="14716971.865151"
            maxy="5360629.56511223" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.CD3E95079D1D425CB5AC212D9AB185BF</Name>
          <Title>Локализованные объекты недвижимости, не являющиеся федеральными</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.841298565269</westBoundLongitude>
            <eastBoundLongitude>132.097676172852</eastBoundLongitude>
            <southBoundLatitude>43.0585248753512</southBoundLatitude>
            <northBoundLatitude>43.3167424144162</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14676506.2218096"
            miny="5291702.17231837"
            maxx="14705046.0465367"
            maxy="5330985.46857348" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0585248753512"
            miny="131.841298565269"
            maxx="43.3167424144162"
            maxy="132.097676172852" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14676506.2218096"
            miny="5320884.17654232"
            maxx="14705046.0465367"
            maxy="5360308.21608218" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14676506.2218096"
            miny="5320884.17654232"
            maxx="14705046.0465367"
            maxy="5360308.21608218" />
        </Layer>
      </Layer>
      <Layer>
        <Title>Распределение объектов недвижимости по формам собственности</Title>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.D018530AA83247D8ACFE08024F39D9BE</Name>
          <Title>Объекты незавершенного строительства</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.841806173325</westBoundLongitude>
            <eastBoundLongitude>132.078975811601</eastBoundLongitude>
            <southBoundLatitude>43.075955076572</southBoundLatitude>
            <northBoundLatitude>43.2959992978335</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14676562.72848"
            miny="5294348.61606951"
            maxx="14702964.3318445"
            maxy="5327823.57119262" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.075955076572"
            miny="131.841806173325"
            maxx="43.2959992978335"
            maxy="132.078975811601" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14676562.72848"
            miny="5323540.13933863"
            maxx="14702964.3318445"
            maxy="5357135.03437085" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14676562.72848"
            miny="5323540.13933863"
            maxx="14702964.3318445"
            maxy="5357135.03437085" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.34D6CBA286F34CF1B12338BA8974FC18</Name>
          <Title>Сооружения</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.846797764301</westBoundLongitude>
            <eastBoundLongitude>132.093275338411</eastBoundLongitude>
            <southBoundLatitude>43.0677929257725</southBoundLatitude>
            <northBoundLatitude>43.3148811417896</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14677118.3898457"
            miny="5293109.2547216"
            maxx="14704556.1478876"
            maxy="5330701.70823869" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0677929257725"
            miny="131.846797764301"
            maxx="43.3148811417896"
            maxy="132.093275338411" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14677118.3898457"
            miny="5322296.32078168"
            maxx="14704556.1478876"
            maxy="5360023.44336449" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14677118.3898457"
            miny="5322296.32078168"
            maxx="14704556.1478876"
            maxy="5360023.44336449" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.86CB81E6643A462CB0D1916DE46168BE</Name>
          <Title>Здания</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.841578856111</westBoundLongitude>
            <eastBoundLongitude>132.09771104157</eastBoundLongitude>
            <southBoundLatitude>43.0675347640395</southBoundLatitude>
            <northBoundLatitude>43.3167263145304</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14676537.4236435"
            miny="5293070.05751169"
            maxx="14705049.9281045"
            maxy="5330983.01402772" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0675347640395"
            miny="131.841578856111"
            maxx="43.3167263145304"
            maxy="132.09771104157" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14676537.4236435"
            miny="5322256.9825845"
            maxx="14705049.9281045"
            maxy="5360305.75277951" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14676537.4236435"
            miny="5322256.9825845"
            maxx="14705049.9281045"
            maxy="5360305.75277951" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.67806561BA814C32B2C57A67EF6887BA</Name>
          <Title>Земельные участки</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.838118135929</westBoundLongitude>
            <eastBoundLongitude>132.204807624221</eastBoundLongitude>
            <southBoundLatitude>43.033091535723</southBoundLatitude>
            <northBoundLatitude>43.318842681118</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14676152.1780351"
            miny="5287841.96359812"
            maxx="14716971.865151"
            maxy="5331305.67526401" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.033091535723"
            miny="131.838118135929"
            maxx="43.318842681118"
            maxy="132.204807624221" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14676152.1780351"
            miny="5317010.07325326"
            maxx="14716971.865151"
            maxy="5360629.56511223" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14676152.1780351"
            miny="5317010.07325326"
            maxx="14716971.865151"
            maxy="5360629.56511223" />
        </Layer>
      </Layer>
      <Layer>
        <Title>Объекты недвижимости, не имеющие установленных границ</Title>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.47FE490E772D46378DF2F5459C44EA5F</Name>
          <Title>Объекты незавершенного строительства</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.848367527127</westBoundLongitude>
            <eastBoundLongitude>132.09255181253</eastBoundLongitude>
            <southBoundLatitude>43.0805806127954</southBoundLatitude>
            <northBoundLatitude>43.3073222766865</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14677293.1350442"
            miny="5295051.04284266"
            maxx="14704475.6053549"
            maxy="5329549.41133596" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0805806127954"
            miny="131.848367527127"
            maxx="43.3073222766865"
            maxy="132.09255181253" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14677293.1350442"
            miny="5324245.09177527"
            maxx="14704475.6053549"
            maxy="5358867.03472955" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14677293.1350442"
            miny="5324245.09177527"
            maxx="14704475.6053549"
            maxy="5358867.03472955" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.C739DF5399184ECDAD5B2E9D4DC6B1FC</Name>
          <Title>Сооружения</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.848367527127</westBoundLongitude>
            <eastBoundLongitude>132.094053849578</eastBoundLongitude>
            <southBoundLatitude>43.0805806127954</southBoundLatitude>
            <northBoundLatitude>43.3073222766865</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14677293.1350442"
            miny="5295051.04284266"
            maxx="14704642.8113543"
            maxy="5329549.41133596" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0805806127954"
            miny="131.848367527127"
            maxx="43.3073222766865"
            maxy="132.094053849578" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14677293.1350442"
            miny="5324245.09177527"
            maxx="14704642.8113543"
            maxy="5358867.03472955" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14677293.1350442"
            miny="5324245.09177527"
            maxx="14704642.8113543"
            maxy="5358867.03472955" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.92A0A6307607420887C3D834C0873A80</Name>
          <Title>Здания</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.848367527127</westBoundLongitude>
            <eastBoundLongitude>132.094053849578</eastBoundLongitude>
            <southBoundLatitude>43.0805806127954</southBoundLatitude>
            <northBoundLatitude>43.3073222766865</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14677293.1350442"
            miny="5295051.04284266"
            maxx="14704642.8113543"
            maxy="5329549.41133596" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0805806127954"
            miny="131.848367527127"
            maxx="43.3073222766865"
            maxy="132.094053849578" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14677293.1350442"
            miny="5324245.09177527"
            maxx="14704642.8113543"
            maxy="5358867.03472955" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14677293.1350442"
            miny="5324245.09177527"
            maxx="14704642.8113543"
            maxy="5358867.03472955" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.9AA28208BEE64A09B0353DE9E524DE3A</Name>
          <Title>Земельные участки</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.848367527127</westBoundLongitude>
            <eastBoundLongitude>132.094053849578</eastBoundLongitude>
            <southBoundLatitude>43.0805806127954</southBoundLatitude>
            <northBoundLatitude>43.3073222766865</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14677293.1350442"
            miny="5295051.04284266"
            maxx="14704642.8113543"
            maxy="5329549.41133596" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0805806127954"
            miny="131.848367527127"
            maxx="43.3073222766865"
            maxy="132.094053849578" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14677293.1350442"
            miny="5324245.09177527"
            maxx="14704642.8113543"
            maxy="5358867.03472955" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14677293.1350442"
            miny="5324245.09177527"
            maxx="14704642.8113543"
            maxy="5358867.03472955" />
        </Layer>
      </Layer>
      <Layer>
        <Title>Объекты недвижимости</Title>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.B5FBE294EE634DCDAB6134ED4C71A45F</Name>
          <Title>Объекты незавершенного строительства</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.841806173325</westBoundLongitude>
            <eastBoundLongitude>132.078975811601</eastBoundLongitude>
            <southBoundLatitude>43.075955076572</southBoundLatitude>
            <northBoundLatitude>43.2959992978335</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14676562.72848"
            miny="5294348.61606951"
            maxx="14702964.3318445"
            maxy="5327823.57119262" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.075955076572"
            miny="131.841806173325"
            maxx="43.2959992978335"
            maxy="132.078975811601" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14676562.72848"
            miny="5323540.13933863"
            maxx="14702964.3318445"
            maxy="5357135.03437085" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14676562.72848"
            miny="5323540.13933863"
            maxx="14702964.3318445"
            maxy="5357135.03437085" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.4D22650120224F9E8D14544B530628E1</Name>
          <Title>Сооружения</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.846797764301</westBoundLongitude>
            <eastBoundLongitude>132.093275338411</eastBoundLongitude>
            <southBoundLatitude>43.0677929257725</southBoundLatitude>
            <northBoundLatitude>43.3148811417896</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14677118.3898457"
            miny="5293109.2547216"
            maxx="14704556.1478876"
            maxy="5330701.70823869" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0677929257725"
            miny="131.846797764301"
            maxx="43.3148811417896"
            maxy="132.093275338411" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14677118.3898457"
            miny="5322296.32078168"
            maxx="14704556.1478876"
            maxy="5360023.44336449" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14677118.3898457"
            miny="5322296.32078168"
            maxx="14704556.1478876"
            maxy="5360023.44336449" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.59EFF83908F4495BBB0C4698005DA25F</Name>
          <Title>Здания</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.841578856111</westBoundLongitude>
            <eastBoundLongitude>132.09771104157</eastBoundLongitude>
            <southBoundLatitude>43.0675347640395</southBoundLatitude>
            <northBoundLatitude>43.3167263145304</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14676537.4236435"
            miny="5293070.05751169"
            maxx="14705049.9281045"
            maxy="5330983.01402772" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0675347640395"
            miny="131.841578856111"
            maxx="43.3167263145304"
            maxy="132.09771104157" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14676537.4236435"
            miny="5322256.9825845"
            maxx="14705049.9281045"
            maxy="5360305.75277951" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14676537.4236435"
            miny="5322256.9825845"
            maxx="14705049.9281045"
            maxy="5360305.75277951" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.452EE4C31E0144779C3E57E9380B75E9</Name>
          <Title>Земельные участки</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.838118135929</westBoundLongitude>
            <eastBoundLongitude>132.204807624221</eastBoundLongitude>
            <southBoundLatitude>43.033091535723</southBoundLatitude>
            <northBoundLatitude>43.318842681118</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14676152.1780351"
            miny="5287841.96359812"
            maxx="14716971.865151"
            maxy="5331305.67526401" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.033091535723"
            miny="131.838118135929"
            maxx="43.318842681118"
            maxy="132.204807624221" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14676152.1780351"
            miny="5317010.07325326"
            maxx="14716971.865151"
            maxy="5360629.56511223" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14676152.1780351"
            miny="5317010.07325326"
            maxx="14716971.865151"
            maxy="5360629.56511223" />
        </Layer>
        <Layer
          queryable="1">
          <Name>7C3D19B5D72D41F883519ED0F8472062.6DCDF1DE3472444D98AF8102D3BFAA3C</Name>
          <Title>Кадастровые кварталы</Title>
          <Abstract />
          <CRS>EPSG:3395</CRS>
          <CRS>EPSG:4326</CRS>
          <CRS>EPSG:3857</CRS>
          <CRS>EPSG:900913</CRS>
          <EX_GeographicBoundingBox>
            <westBoundLongitude>131.840417459607</westBoundLongitude>
            <eastBoundLongitude>132.099538967013</eastBoundLongitude>
            <southBoundLatitude>43.0575944656023</southBoundLatitude>
            <northBoundLatitude>43.3190456298727</northBoundLatitude>
          </EX_GeographicBoundingBox>
          <BoundingBox
            CRS="EPSG:3395"
            minx="14676408.1375761"
            miny="5291560.9286409"
            maxx="14705253.4118341"
            maxy="5331336.61742457" />
          <BoundingBox
            CRS="EPSG:4326"
            minx="43.0575944656023"
            miny="131.840417459607"
            maxx="43.3190456298727"
            maxy="132.099538967013" />
          <BoundingBox
            CRS="EPSG:3857"
            minx="14676408.1375761"
            miny="5320742.42467053"
            maxx="14705253.4118341"
            maxy="5360660.61765497" />
          <BoundingBox
            CRS="EPSG:900913"
            minx="14676408.1375761"
            miny="5320742.42467053"
            maxx="14705253.4118341"
            maxy="5360660.61765497" />
        </Layer>
      </Layer>
      <Layer>
        <Title>Спутниковая съемка</Title>
        <Layer>
          <Title>Покрытие 2018-2019гг</Title>
          <Layer
            queryable="1">
            <Name>7C3D19B5D72D41F883519ED0F8472062.5C250D87930B4498964CBF0B62C91D79</Name>
            <Title>Даты сцен покрытия 2018-2019гг</Title>
            <Abstract />
            <CRS>EPSG:3395</CRS>
            <CRS>EPSG:4326</CRS>
            <CRS>EPSG:3857</CRS>
            <CRS>EPSG:900913</CRS>
            <EX_GeographicBoundingBox>
              <westBoundLongitude>131.839999035001</westBoundLongitude>
              <eastBoundLongitude>132.104816883802</eastBoundLongitude>
              <southBoundLatitude>43.0563641864862</southBoundLatitude>
              <northBoundLatitude>43.3210575178768</northBoundLatitude>
            </EX_GeographicBoundingBox>
            <BoundingBox
              CRS="EPSG:3395"
              minx="14676361.558762"
              miny="5291374.1656976"
              maxx="14705840.9468435"
              maxy="5331643.36138295" />
            <BoundingBox
              CRS="EPSG:4326"
              minx="43.0563641864862"
              miny="131.839999035001"
              maxx="43.3210575178768"
              maxy="132.104816883802" />
            <BoundingBox
              CRS="EPSG:3857"
              minx="14676361.558762"
              miny="5320554.98973105"
              maxx="14705840.9468435"
              maxy="5360968.4558431" />
            <BoundingBox
              CRS="EPSG:900913"
              minx="14676361.558762"
              miny="5320554.98973105"
              maxx="14705840.9468435"
              maxy="5360968.4558431" />
          </Layer>
          <Layer>
            <Title>Спутниковая съемка 2018-2019гг</Title>
            <Layer
              queryable="0">
              <Name>B0C199148C904859BBBBCBA33FD9D8BC</Name>
              <Title>R1C1</Title>
              <Abstract />
              <CRS>EPSG:3395</CRS>
              <CRS>EPSG:4326</CRS>
              <CRS>EPSG:3857</CRS>
              <CRS>EPSG:900913</CRS>
              <EX_GeographicBoundingBox>
                <westBoundLongitude>131.976152600845</westBoundLongitude>
                <eastBoundLongitude>132.104095523039</eastBoundLongitude>
                <southBoundLatitude>43.2313922202052</southBoundLatitude>
                <northBoundLatitude>43.3205670673142</northBoundLatitude>
              </EX_GeographicBoundingBox>
              <BoundingBox
                CRS="EPSG:3395"
                minx="14691518.1043814"
                miny="5317982.39326354"
                maxx="14705760.6453307"
                maxy="5331568.58354061" />
              <BoundingBox
                CRS="EPSG:4326"
                minx="43.2313922202052"
                miny="131.976152600845"
                maxx="43.3205670673142"
                maxy="132.104095523039" />
              <BoundingBox
                CRS="EPSG:3857"
                minx="14691518.1043814"
                miny="5347258.6854706"
                maxx="14705760.6453307"
                maxy="5360893.41125683" />
              <BoundingBox
                CRS="EPSG:900913"
                minx="14691518.1043814"
                miny="5347258.6854706"
                maxx="14705760.6453307"
                maxy="5360893.41125683" />
            </Layer>
            <Layer
              queryable="0">
              <Name>09461D532A4742AF9163292E899E9469</Name>
              <Title>R2C1</Title>
              <Abstract />
              <CRS>EPSG:3395</CRS>
              <CRS>EPSG:4326</CRS>
              <CRS>EPSG:3857</CRS>
              <CRS>EPSG:900913</CRS>
              <EX_GeographicBoundingBox>
                <westBoundLongitude>131.894897043969</westBoundLongitude>
                <eastBoundLongitude>132.029422259214</eastBoundLongitude>
                <southBoundLatitude>43.1423983650814</southBoundLatitude>
                <northBoundLatitude>43.2330134352578</northBoundLatitude>
              </EX_GeographicBoundingBox>
              <BoundingBox
                CRS="EPSG:3395"
                minx="14682472.7771659"
                miny="5304443.7228741"
                maxx="14697448.0556258"
                maxy="5318229.21386609" />
              <BoundingBox
                CRS="EPSG:4326"
                minx="43.1423983650814"
                miny="131.894897043969"
                maxx="43.2330134352578"
                maxy="132.029422259214" />
              <BoundingBox
                CRS="EPSG:3857"
                minx="14682472.7771659"
                miny="5333671.50773573"
                maxx="14697448.0556258"
                maxy="5347506.3890877" />
              <BoundingBox
                CRS="EPSG:900913"
                minx="14682472.7771659"
                miny="5333671.50773573"
                maxx="14697448.0556258"
                maxy="5347506.3890877" />
            </Layer>
            <Layer
              queryable="0">
              <Name>AE7EE00356D946EFA7922C91E249546A</Name>
              <Title>R3C1</Title>
              <Abstract />
              <CRS>EPSG:3395</CRS>
              <CRS>EPSG:4326</CRS>
              <CRS>EPSG:3857</CRS>
              <CRS>EPSG:900913</CRS>
              <EX_GeographicBoundingBox>
                <westBoundLongitude>131.840947152461</westBoundLongitude>
                <eastBoundLongitude>132.014754841649</eastBoundLongitude>
                <southBoundLatitude>43.0574000011199</southBoundLatitude>
                <northBoundLatitude>43.1454153453103</northBoundLatitude>
              </EX_GeographicBoundingBox>
              <BoundingBox
                CRS="EPSG:3395"
                minx="14676467.1027149"
                miny="5291531.40764231"
                maxx="14695815.2861712"
                maxy="5304902.37196153" />
              <BoundingBox
                CRS="EPSG:4326"
                minx="43.0574000011199"
                miny="131.840947152461"
                maxx="43.1454153453103"
                maxy="132.014754841649" />
              <BoundingBox
                CRS="EPSG:3857"
                minx="14676467.1027149"
                miny="5320712.79745353"
                maxx="14695815.2861712"
                maxy="5334131.80241995" />
              <BoundingBox
                CRS="EPSG:900913"
                minx="14676467.1027149"
                miny="5320712.79745353"
                maxx="14695815.2861712"
                maxy="5334131.80241995" />
            </Layer>
          </Layer>
        </Layer>
        <Layer>
          <Title>Покрытие 2015-2017гг</Title>
          <Layer
            queryable="1">
            <Name>7C3D19B5D72D41F883519ED0F8472062.CD3E7B4713394B9FB52B530D7AB356B2</Name>
            <Title>Даты сцен покрытия 2015-2017гг</Title>
            <Abstract />
            <CRS>EPSG:3395</CRS>
            <CRS>EPSG:4326</CRS>
            <CRS>EPSG:3857</CRS>
            <CRS>EPSG:900913</CRS>
            <EX_GeographicBoundingBox>
              <westBoundLongitude>131.830702498555</westBoundLongitude>
              <eastBoundLongitude>132.102037444711</eastBoundLongitude>
              <southBoundLatitude>43.0511331423584</southBoundLatitude>
              <northBoundLatitude>43.3214868161008</northBoundLatitude>
            </EX_GeographicBoundingBox>
            <BoundingBox
              CRS="EPSG:3395"
              minx="14675326.6730587"
              miny="5290580.10738242"
              maxx="14705531.5410992"
              maxy="5331708.81597119" />
            <BoundingBox
              CRS="EPSG:4326"
              minx="43.0511331423584"
              miny="131.830702498555"
              maxx="43.3214868161008"
              maxy="132.102037444711" />
            <BoundingBox
              CRS="EPSG:3857"
              minx="14675326.6730587"
              miny="5319758.07399476"
              maxx="14705531.5410992"
              maxy="5361034.14391428" />
            <BoundingBox
              CRS="EPSG:900913"
              minx="14675326.6730587"
              miny="5319758.07399476"
              maxx="14705531.5410992"
              maxy="5361034.14391428" />
          </Layer>
          <Layer>
            <Title>Спутниковая съемка 2015-2017гг</Title>
            <Layer
              queryable="0">
              <Name>6272E2EA763B4BED8994025FA938591E</Name>
              <Title>R1C1</Title>
              <Abstract />
              <CRS>EPSG:3395</CRS>
              <CRS>EPSG:4326</CRS>
              <CRS>EPSG:3857</CRS>
              <CRS>EPSG:900913</CRS>
              <EX_GeographicBoundingBox>
                <westBoundLongitude>131.960282887214</westBoundLongitude>
                <eastBoundLongitude>132.101004452119</eastBoundLongitude>
                <southBoundLatitude>43.2300684795891</southBoundLatitude>
                <northBoundLatitude>43.3208148816937</northBoundLatitude>
              </EX_GeographicBoundingBox>
              <BoundingBox
                CRS="EPSG:3395"
                minx="14689751.495941"
                miny="5317780.86632482"
                maxx="14705416.5488899"
                maxy="5331606.36713951" />
              <BoundingBox
                CRS="EPSG:4326"
                minx="43.2300684795891"
                miny="131.960282887214"
                maxx="43.3208148816937"
                maxy="132.101004452119" />
              <BoundingBox
                CRS="EPSG:3857"
                minx="14689751.495941"
                miny="5347056.43752313"
                maxx="14705416.5488899"
                maxy="5360931.3296361" />
              <BoundingBox
                CRS="EPSG:900913"
                minx="14689751.495941"
                miny="5347056.43752313"
                maxx="14705416.5488899"
                maxy="5360931.3296361" />
            </Layer>
            <Layer
              queryable="0">
              <Name>F78514870993418FBC138D97E005840C</Name>
              <Title>R2C1</Title>
              <Abstract />
              <CRS>EPSG:3395</CRS>
              <CRS>EPSG:4326</CRS>
              <CRS>EPSG:3857</CRS>
              <CRS>EPSG:900913</CRS>
              <EX_GeographicBoundingBox>
                <westBoundLongitude>131.88287024748</westBoundLongitude>
                <eastBoundLongitude>132.042221226468</eastBoundLongitude>
                <southBoundLatitude>43.1408898181923</southBoundLatitude>
                <northBoundLatitude>43.2324601706168</northBoundLatitude>
              </EX_GeographicBoundingBox>
              <BoundingBox
                CRS="EPSG:3395"
                minx="14681133.9603048"
                miny="5304214.39824801"
                maxx="14698872.8301432"
                maxy="5318144.98178544" />
              <BoundingBox
                CRS="EPSG:4326"
                minx="43.1408898181923"
                miny="131.88287024748"
                maxx="43.2324601706168"
                maxy="132.042221226468" />
              <BoundingBox
                CRS="EPSG:3857"
                minx="14681133.9603048"
                miny="5333441.36025003"
                maxx="14698872.8301432"
                maxy="5347421.85566735" />
              <BoundingBox
                CRS="EPSG:900913"
                minx="14681133.9603048"
                miny="5333441.36025003"
                maxx="14698872.8301432"
                maxy="5347421.85566735" />
            </Layer>
            <Layer
              queryable="0">
              <Name>8D6A53015AFA4EEAA712368538321842</Name>
              <Title>R3C1</Title>
              <Abstract />
              <CRS>EPSG:3395</CRS>
              <CRS>EPSG:4326</CRS>
              <CRS>EPSG:3857</CRS>
              <CRS>EPSG:900913</CRS>
              <EX_GeographicBoundingBox>
                <westBoundLongitude>131.836990078226</westBoundLongitude>
                <eastBoundLongitude>132.01955344494</eastBoundLongitude>
                <southBoundLatitude>43.0555993667587</southBoundLatitude>
                <northBoundLatitude>43.1443937651994</northBoundLatitude>
              </EX_GeographicBoundingBox>
              <BoundingBox
                CRS="EPSG:3395"
                minx="14676026.603226"
                miny="5291258.06387874"
                maxx="14696349.4642461"
                maxy="5304747.06617513" />
              <BoundingBox
                CRS="EPSG:4326"
                minx="43.0555993667587"
                miny="131.836990078226"
                maxx="43.1443937651994"
                maxy="132.01955344494" />
              <BoundingBox
                CRS="EPSG:3857"
                minx="14676026.603226"
                miny="5320438.47014989"
                maxx="14696349.4642461"
                maxy="5333975.93942681" />
              <BoundingBox
                CRS="EPSG:900913"
                minx="14676026.603226"
                miny="5320438.47014989"
                maxx="14696349.4642461"
                maxy="5333975.93942681" />
            </Layer>
          </Layer>
        </Layer>
      </Layer>
    </Layer>
  </Capability>
</WMS_Capabilities>`;

export {WFS, WMS};