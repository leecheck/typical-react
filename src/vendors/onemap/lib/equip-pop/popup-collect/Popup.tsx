/**
 *社区总览展示摄像头抓拍
 *
 */

import React from 'react';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import {
  IFStructuralLinkInfo,
  ETargetType,
  IFStructuralInfo,
  IFDeviceInfo,
  ICameraInfo,
  EDeviceOnlineStatus,
} from 'app-vendors/types';
import FaceResultsPresentationPanel from 'app-subapps/face/components/face-results-presentation-panel/src/FaceResultsPresentationPanelPop';
import {
  CollectionAnalysisResultRequest,
  getCameraTackeCount,
  MacImeiImsiRequest,
} from 'app-vendors/bussiness-requests';
import CarWithTip from 'app-subapps-common/structural-item/face-with-tip';
import { openNewTabWithStructualInfo } from 'app-subapps-common/utils/search-utils';
import { showSourcePreviewer } from 'app-subapps-common/source-previewer';
import moment from 'moment';
import { Empty, Button, message } from 'antd';
import ModuleStyle from './index.module.scss';
import classnames from 'classnames';
import FLVPlayer from 'app-vendors/video-player/PlayerById';
import { ESourceType } from 'app-vendors/types';

import { StringChain } from 'lodash';
interface OwnProps extends InjectedIntlProps {
  cameraInfo: ICameraInfo;
  onClose?: () => void;
  onItemClick: (
    key: string,
    data: {
      [propName: string]: any;
    },
  ) => void;
}

export enum ETypeLabel {
  人脸相机 = 20,
  车辆卡口 = 10,
  视频监控 = 21,
  高点监控 = 18,
  结构化智能摄像机 = 19,
}

const Popup = (props: OwnProps) => {
  const [data, setData] = React.useState<IFStructuralLinkInfo[] | IFStructuralInfo[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [showVideo, setShowVideo] = React.useState<boolean>(false); // 设置当前是视频面板还是属性面板
  const [videoSwitch, setVideoSwitch] = React.useState<boolean>(false); // 处理当前类型是否支持视频和信息的切换

  const onItemClick = (key: string) => {
    props.onItemClick && props.onItemClick(key, props.cameraInfo);
  };

  React.useEffect(() => {
    if (props.cameraInfo) {
      setData([]);
      let { deviceType } = props.cameraInfo;
      if (deviceType == ETypeLabel.人脸相机) {
        getAnalysisData(ETargetType.Face);
        getCount(ETargetType.Face);
        setShowVideo(false);
        setVideoSwitch(true);
      } else if (deviceType == ETypeLabel.车辆卡口) {
        getAnalysisData(ETargetType.Vehicle);
        getCount(ETargetType.Vehicle);
        setShowVideo(false);
        setVideoSwitch(true);
      } else {
        //  除了人脸、车辆 都是直接播放视频
        setVideoSwitch(false);
        setShowVideo(true);
      }
    }
  }, [props.cameraInfo]);

  const playVideo = () => {
    setShowVideo(true);
  };
  const closeVideo = () => {
    setShowVideo(false);
  };
  //
  const getCount = async (type: string) => {
    getCameraTackeCount({
      sourceIds: props.cameraInfo.id,
      serviceType: type,
    }).then((res) => {
      setTotal(res.dataCount);
    });
  };

  const onClose = () => {
    props.onClose && props.onClose();
  };

  const getAnalysisData = (type: String) => {
    CollectionAnalysisResultRequest.getAnalysisResult({
      sources: [
        {
          sourceId: props.cameraInfo.id,
          sourceType: ESourceType.Camera,
        },
      ],
      relative: false,
      page: 1,
      pageSize: 5,
      targetTypes: [type],
    }).then((res) => {
      setData(res.list.slice(0, 5));
    });
  };
  const renderFace = () => {
    return (
      <div>
        <FaceResultsPresentationPanel
          // className={this.props.className}
          allPointsArr={[props.cameraInfo]}
          resultsList={data}
          showFaceRelative={false}
          hasMore={false}
          isFirstLoading={false}
          loadMore={() => {}}
          currentTargetType={ETargetType.Face}
          searchTargetType={ETargetType.Face}
          isLoadingMore={false}
          isUploading={false}
          onShowDocumentDetail={() => {}}
          searchTargetList={[]}
          facePageShowCar={false}
          showCarWithFaceInfo={false}
          isVideoDoor={false}
        />
      </div>
    );
  };
  const renderCar = () => {
    return (
      <div className={ModuleStyle['car-list']}>
        {data && data.length > 0 ? (
          data.map((wrappedData: any, index: number) => {
            let vehicle = wrappedData['vehicle'];
            let vehicles = wrappedData['vehicles'];
            if (!vehicle) {
              return '';
            }
            return (
              <div
                className={ModuleStyle['car-item']}
                onClick={() => {
                  handleShowBigImage(
                    vehicle,
                    index,
                    vehicles,
                    // @ts-ignore
                    (list: IFStructuralInfo[], next) => {
                      return list[next];
                    },
                  );
                }}
              >
                <img
                  src={vehicle.targetImageUrl}
                  alt="info"
                  className={`${ModuleStyle['latest-url']}`}
                  title="查看大图"
                />
                <div>
                  {vehicle &&
                    vehicle.attributeProperties.length &&
                    vehicle.attributeProperties.map((item, index) => {
                      if (item['attributeType'] == 'car-license-number') {
                        return (
                          <p key={index} style={{ margin: 0 }}>
                            <strong title={item.attributeValue}>
                              {item.attributeValue || '未知'}
                            </strong>
                          </p>
                        );
                      }
                    })}
                </div>
                <div>
                  <span>{vehicle.time.split(' ')[1]}</span>
                </div>
              </div>
            );
          })
        ) : (
          <Empty style={{ marginBottom: 20 }}></Empty>
        )}
      </div>
    );
  };
  const renderHeader = () => {
    let { deviceType, online } = props.cameraInfo;
    const isOnline = online === EDeviceOnlineStatus.Online;
    return (
      <>
        <p style={{ padding: '10px 0 0 30px', margin: 0 }}>
          <span className="info-title-span">所属区域：</span>
          <span className="info-area">{props.cameraInfo.areaName}</span>
        </p>
        <p style={{ padding: '10px 0 0 30px', margin: 0 }}>
          <span className="info-title-span">设备状态：</span>
          <span className={isOnline ? ModuleStyle['online'] : ModuleStyle['offline']}>
            {isOnline ? '在线' : '离线'}
          </span>
        </p>
        {(deviceType == ETypeLabel.人脸相机 || deviceType == ETypeLabel.车辆卡口) && (
          <p style={{ padding: '10px 0 0 30px' }}>
            <span className="info-title-span">今日抓拍：</span>
            <span
              style={{ cursor: 'pointer', color: '#00539b', textDecoration: 'underline' }}
              onClick={() => {
                onItemClick('抓拍');
              }}
              className="info-area"
            >
              {total ? `${total}张` : '0'}
            </span>
          </p>
        )}
      </>
    );
  };
  const renderFooter = () => {
    let { deviceType } = props.cameraInfo;
    switch (deviceType) {
      case ETypeLabel.人脸相机:
      case ETypeLabel.车辆卡口:
        return (
          <div className={ModuleStyle['footer']}>
            <Button type="primary" ghost onClick={playVideo}>
              视频播放
            </Button>
          </div>
        );
      default:
        return '';
        break;
    }
  };
  const renderContent = () => {
    let { deviceType } = props.cameraInfo;
    switch (deviceType) {
      case ETypeLabel.人脸相机:
        return renderFace();
      case ETypeLabel.车辆卡口:
        return renderCar();
      default:
        return '';
        break;
    }
  };
  const handleShowBigImage = (
    info: IFStructuralInfo,
    index: number,
    list: Array<IFStructuralLinkInfo> | IFStructuralInfo[],
    getStructuralInfo: (
      list: IFStructuralLinkInfo[] | IFStructuralInfo[],
      index: number,
    ) => IFStructuralInfo | undefined,
  ) => {
    let handle = showSourcePreviewer({
      intl: props.intl,
      allPointsArr: [props.cameraInfo],
      guid: info.guid,
      sourceId: String(info.sourceId),
      sourceType: info.sourceType,
      structuralInfoId: info.id,
      strucutralInfo: info,
      originalImageId: info.orignialImageId,
      originalImageUrl: info.originalImageUrl,
      originImageBankType: info.fromLibType,
      originalImageWidth: info.originalImageWidth,
      originalImageHeight: info.originalImageHeight,
      // title,
      currentIndex: index,
      indicator: `${index + 1}/${list.length}`,
      disableLeftArrow: index <= 0,
      disableRightArrow: index >= list.length - 1,
      showType: info.targetType,
      noQuickSearch: true, // 暂无以图搜车功能，故隐藏快速检索
      onQuickSearch: function onQuickSearch(item: IFStructuralInfo, jumpTo?: ETargetType) {
        openNewTabWithStructualInfo([item], jumpTo);
      },
      goNext: (currentIndex: number) => {
        let nextIndex = Math.max(0, Math.min(list.length - 1, currentIndex + 1));

        let next: IFStructuralInfo | undefined = getStructuralInfo(list, nextIndex);

        handle.update({
          guid: next ? next.guid : undefined,
          sourceId: next ? next.sourceId : undefined,
          sourceType: next ? next.sourceType : undefined,
          structuralInfoId: next ? next.id : undefined,
          strucutralInfo: next,
          currentIndex: nextIndex,
          originalImageId: next ? next.orignialImageId : undefined,
          originalImageUrl: next ? next.originalImageUrl : undefined,
          originImageBankType: next ? next.fromLibType : undefined,
          originalImageWidth: next ? next.originalImageWidth : undefined,
          originalImageHeight: next ? next.originalImageHeight : undefined,
          indicator: `${nextIndex + 1}/${list.length}`,
          disableLeftArrow: false,
          disableRightArrow: nextIndex >= list.length - 1,
        });
      },
      goPrev: (currentIndex: number) => {
        let prevIndex = Math.max(0, Math.min(list.length - 1, currentIndex - 1));

        let prev: IFStructuralInfo | undefined = getStructuralInfo(list, prevIndex);

        handle.update({
          guid: prev ? prev.guid : undefined,
          sourceId: prev ? prev.sourceId : undefined,
          sourceType: prev ? prev.sourceType : undefined,
          structuralInfoId: prev ? prev.id : undefined,
          strucutralInfo: prev ? prev : undefined,
          currentIndex: prevIndex,
          originalImageId: prev ? prev.orignialImageId : undefined,
          originalImageUrl: prev ? prev.originalImageUrl : undefined,
          originImageBankType: prev ? prev.fromLibType : undefined,
          originalImageWidth: prev ? prev.originalImageWidth : undefined,
          originalImageHeight: prev ? prev.originalImageHeight : undefined,
          indicator: `${prevIndex + 1}/${list.length}`,
          disableLeftArrow: prevIndex <= 0,
          disableRightArrow: false,
        });
      },
      onClose: () => {
        handle.destory();
      },
      onOk: () => {
        handle.destory();
      },
    });
  };
  return (
    <div
      className={classnames('leaflet-camera-wrap single-info', ModuleStyle['popup'])}
      style={showVideo ? { height: 400 } : {}}
    >
      {' '}
      <div className={ModuleStyle['pop-close']} onClick={onClose}>
        ✖
      </div>
      {showVideo ? (
        <>
          <div className={ModuleStyle['video-top']}>
            <div className={ModuleStyle['video-title']}>{props.cameraInfo.name}</div>
            <Button
              className={ModuleStyle['video-close']}
              type="primary"
              style={{ display: videoSwitch ? 'block' : 'none' }}
              // ghost
              onClick={closeVideo}
            >
              返回
            </Button>
          </div>
          <FLVPlayer
            style={{ background: '#000000' }}
            id={props.cameraInfo.id}
            onError={() => {
              message.error('此点位视频播放失败');
            }}
          ></FLVPlayer>
        </>
      ) : (
        <>
          <h5 className="sgH5" style={{ border: 'none' }}>
            <span
              className={classnames(
                ModuleStyle['type' + props.cameraInfo.deviceType],
                ModuleStyle['icon'],
              )}
            ></span>{' '}
            <span>{props.cameraInfo.name}</span>
          </h5>
          <div className="camera-content-container" style={{ padding: 0 }}>
            <div className="camera-item-info">
              {renderHeader()}
              {renderContent()}
              {renderFooter()}
            </div>
          </div>
        </>
      )}
      {/* <div className={ModuleStyle['pop-guide']}></div> */}
    </div>
  );
};

export default injectIntl(Popup);
