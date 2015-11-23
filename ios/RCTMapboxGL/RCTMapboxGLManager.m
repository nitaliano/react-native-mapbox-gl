//
//  RCTMapboxGLManager.m
//  RCTMapboxGL
//
//  Created by Bobby Sudekum on 4/30/15.
//  Copyright (c) 2015 Mapbox. All rights reserved.
//

#import "RCTMapboxGLManager.h"
#import "RCTMapboxGL.h"
#import "Mapbox.h"
#import "MGLMapCamera.h"
#import "RCTMGLAnnotation.h"
#import "RCTMGLAnnotationPolyline.h"
#import "RCTMGLAnnotationPolygon.h"
#import "RCTMGLAnnotationProtocol.h"
#import "RCTConvert.h"
#import "RCTConvert+CoreLocation.h"
#import "RCTConvert+MapKit.h"
#import "RCTBridge.h"
#import "UIView+React.h"
#import "RCTUIManager.h"
#import "RCTEventDispatcher.h"
#import "RCTSparseArray.h"

@interface RCTMapboxGLManager() <MGLMapViewDelegate, UIGestureRecognizerDelegate>

@end

@implementation RCTMapboxGLManager {
    NSMutableArray* _annotations;
    NSMutableArray* _overlays;
    BOOL _mapIsLoaded;
}

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (UIView *)view
{
    RCTMapboxGL *map = [RCTMapboxGL new];
    map.delegate = self;
    
    _annotations = [NSMutableArray array];
    _overlays = [NSMutableArray array];
    _mapIsLoaded = NO;
    
    UITapGestureRecognizer *doubleTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:nil];
    doubleTap.numberOfTapsRequired = 2;
    [map addGestureRecognizer:doubleTap];
    
    UITapGestureRecognizer *singleTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleSingleTap:)];
    [singleTap requireGestureRecognizerToFail:doubleTap];
    singleTap.delegate = self;
    [map addGestureRecognizer:singleTap];
    
    return map;
}

- (NSArray *)customDirectEventTypes
{
    return @[
             @"onRightAccessoryCalloutTapped",
             @"onAnnotationSelected",
             @"onAnnotationDeselected",
             @"onUpdateUserLocation",
             @"onLocateUserFailed",
             @"onRegionChanged",
             @"onTap"
             ];
}

- (NSDictionary *)constantsToExport
{
    return @{
             @"styles": @{
                 @"light": [[MGLStyle lightStyleURL] absoluteString],
                 @"dark": [[MGLStyle darkStyleURL] absoluteString],
                 @"streets": [[MGLStyle streetsStyleURL] absoluteString],
                 @"emerald": [[MGLStyle emeraldStyleURL] absoluteString],
                 @"satellite": [[MGLStyle satelliteStyleURL] absoluteString],
                 @"hybrid": [[MGLStyle hybridStyleURL] absoluteString],
            }
    };
}

RCT_CUSTOM_VIEW_PROPERTY(accessToken, NSString, RCTMapboxGL)
{
    [view setAccessToken:json];
}

RCT_CUSTOM_VIEW_PROPERTY(attributionButtonIsHidden, BOOL, RCTMapboxGL)
{
    [view setAttributionButtonVisibility:json ? false : true];
}

RCT_CUSTOM_VIEW_PROPERTY(annotations, NSArray, RCTMapboxGL)
{
    [_annotations removeAllObjects];
    [_overlays removeAllObjects];
    
    if (!_mapIsLoaded) {
        // setTimeout(1500);
        dispatch_time_t delay = dispatch_time(DISPATCH_TIME_NOW, NSEC_PER_SEC * 1.5);
        dispatch_after(delay, dispatch_get_main_queue(), ^(void){
            [self addAnnotations:view.reactTag annotations:json];
        });
    }
    else {
        [self addAnnotations:view.reactTag annotations:json];
    }
}

RCT_EXPORT_VIEW_PROPERTY(styleURL, NSURL)
RCT_EXPORT_VIEW_PROPERTY(clipsToBounds, BOOL);
RCT_EXPORT_VIEW_PROPERTY(debugActive, BOOL);
RCT_EXPORT_VIEW_PROPERTY(rotateEnabled, BOOL);
RCT_EXPORT_VIEW_PROPERTY(scrollEnabled, BOOL);
RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL);
RCT_EXPORT_VIEW_PROPERTY(pitchEnabled, BOOL);
RCT_EXPORT_VIEW_PROPERTY(centerCoordinate, CLLocationCoordinate2D);
RCT_EXPORT_VIEW_PROPERTY(direction, double);
RCT_EXPORT_VIEW_PROPERTY(zoomLevel, double);
RCT_EXPORT_VIEW_PROPERTY(showsUserLocation, BOOL);
RCT_EXPORT_VIEW_PROPERTY(userTrackingMode, MGLUserTrackingMode);


RCT_EXPORT_METHOD(setZoomLevel:(nonnull NSNumber *)reactTag
                  zoomLevel:(double)zoomLevel
                  animated:(BOOL)animated)
{
    dispatch_async(self.bridge.uiManager.methodQueue, ^{
        [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
            RCTMapboxGL *mapView = viewRegistry[reactTag];
            if ([mapView isKindOfClass:[RCTMapboxGL class]]) {
                [mapView setZoomLevel:zoomLevel animated:animated];
            }
        }];
    });
}

RCT_EXPORT_METHOD(setDirection:(nonnull NSNumber *)reactTag
                  heading:(float)heading
                  animated:(BOOL)animated)
{
    dispatch_async(self.bridge.uiManager.methodQueue, ^{
        [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
            RCTMapboxGL *mapView = viewRegistry[reactTag];
            if ([mapView isKindOfClass:[RCTMapboxGL class]]) {
                [mapView setDirection:heading animated:animated];
            }
        }];
    });
}

RCT_EXPORT_METHOD(setCenterCoordinate:(nonnull NSNumber *)reactTag
                  centerCoordinate:(NSDictionary *)centerCoordinate
                  animated:(BOOL)animated)
{
    dispatch_async(self.bridge.uiManager.methodQueue, ^{
        [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
            RCTMapboxGL *mapView = viewRegistry[reactTag];
            if ([mapView isKindOfClass:[RCTMapboxGL class]]) {
                [mapView setCenterCoordinate:[RCTConvert CLLocationCoordinate2D:centerCoordinate] animated:animated];
            }
        }];
    });
    
}

RCT_EXPORT_METHOD(setCenterCoordinateAndZoomLevel:(nonnull NSNumber *)reactTag
                  centerCoordinate:(NSDictionary *)centerCoordinate
                  zoomLevel:(double)zoomLevel
                  animated:(BOOL)animated)
{
    dispatch_async(self.bridge.uiManager.methodQueue, ^{
        [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
            RCTMapboxGL *mapView = viewRegistry[reactTag];
            if ([mapView isKindOfClass:[RCTMapboxGL class]]) {
                [mapView setCenterCoordinate:[RCTConvert CLLocationCoordinate2D:centerCoordinate]
                                   zoomLevel:zoomLevel
                                    animated:animated];
            }
        }];
    });
}

RCT_EXPORT_METHOD(setVisibleCoordinateBounds:(nonnull NSNumber *)reactTag
                  sw:(NSDictionary *)sw
                  ne:(NSDictionary *)ne
                  edgePadding:(NSDictionary *)edgePadding
                  animated:(BOOL)animated)
{
    dispatch_async(self.bridge.uiManager.methodQueue, ^{
        [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
            RCTMapboxGL *mapView = viewRegistry[reactTag];
            if ([mapView isKindOfClass:[RCTMapboxGL class]]) {
                
                MGLCoordinateBounds coordinatesBounds = MGLCoordinateBoundsMake(
                                                            [RCTConvert CLLocationCoordinate2D:sw],
                                                            [RCTConvert CLLocationCoordinate2D:ne]);
                
                [mapView setVisibleCoordinateBounds:coordinatesBounds
                                        edgePadding:UIEdgeInsetsMake(
                                                                     [RCTConvert float:edgePadding[@"top"]],
                                                                     [RCTConvert float:edgePadding[@"left"]],
                                                                     [RCTConvert float:edgePadding[@"bottom"]],
                                                                     [RCTConvert float:edgePadding[@"right"]])
                                           animated:animated];
            }
        }];
    });
}

RCT_EXPORT_METHOD(addAnnotations:(nonnull NSNumber *)reactTag
                  annotations:(NSArray *)annotations)
{
    dispatch_async(self.bridge.uiManager.methodQueue, ^{
        [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
            RCTMapboxGL *mapView = viewRegistry[reactTag];
            if ([mapView isKindOfClass:[RCTMapboxGL class]]) {
                NSDictionary *createdAnnotations = [self createAnnotations:annotations];
                
                if (!_mapIsLoaded) {
                    // setTimeout(1500);
                    dispatch_time_t delay = dispatch_time(DISPATCH_TIME_NOW, NSEC_PER_SEC * 1.5);
                    dispatch_after(delay, dispatch_get_main_queue(), ^(void){
                        [mapView addAnnotations:createdAnnotations[@"annotations"]];
                        [mapView addOverlays:createdAnnotations[@"overlays"]];
                    });
                }
                else {
                    [mapView addAnnotations:createdAnnotations[@"annotations"]];
                    [mapView addOverlays:createdAnnotations[@"overlays"]];
                }
            }
        }];
    });
}

RCT_EXPORT_METHOD(showAnnotations:(nonnull NSNumber *) reactTag
                  annotationIds:(NSArray *)annotationIds
                  animated:(BOOL)animated)
{
    dispatch_async(self.bridge.uiManager.methodQueue, ^{
        [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
            RCTMapboxGL *mapView = viewRegistry[reactTag];
            if ([mapView isKindOfClass:[RCTMapboxGL class]]) {
                NSDictionary *annotations = [self getAnnotations:annotationIds];
                
                [mapView showAnnotations:[annotations[@"annotations"] arrayByAddingObjectsFromArray:annotations[@"overlays"]] animated:animated];
            }
        }];
    });
}

RCT_EXPORT_METHOD(selectAnnotation:(nonnull NSNumber *) reactTag
                  annotationId:(NSString *)annotationId
                  animated:(BOOL)animated)
{
    dispatch_async(self.bridge.uiManager.methodQueue, ^{
        [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
            RCTMapboxGL *mapView = viewRegistry[reactTag];
            if ([mapView isKindOfClass:[RCTMapboxGL class]]) {
                NSArray *annotations = [self getAnnotations:@[annotationId]][@"annotations"];
                
                if ([annotations count]) {
                    [mapView selectAnnotation:annotations[0] animated:animated];
                }
            }
        }];
    });
}

RCT_EXPORT_METHOD(deselectAnnotation:(nonnull NSNumber *) reactTag
                  annotationId:(NSString *)annotationId
                  animated:(BOOL)animated)
{
    dispatch_async(self.bridge.uiManager.methodQueue, ^{
        [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
            RCTMapboxGL *mapView = viewRegistry[reactTag];
            if ([mapView isKindOfClass:[RCTMapboxGL class]]) {
                NSArray *annotations = [self getAnnotations:@[annotationId]][@"annotations"];
                
                if ([annotations count]) {
                    [mapView deselectAnnotation:annotations[0] animated:animated];
                }
            }
        }];
    });
}

RCT_EXPORT_METHOD(removeAnnotations:(nonnull NSNumber *) reactTag
                  annotationIds:(NSArray *)annotationIds)
{
    dispatch_async(self.bridge.uiManager.methodQueue, ^{
        [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
            RCTMapboxGL *mapView = viewRegistry[reactTag];
            if ([mapView isKindOfClass:[RCTMapboxGL class]]) {
                NSDictionary *annotations = [self getAnnotations:annotationIds];
                
                [mapView removeAnnotations:annotations[@"annotations"]];
                [_annotations removeObjectsInArray:annotations[@"annotations"]];
                
                [mapView removeOverlays:annotations[@"overlays"]];
                [_overlays removeObjectsInArray:annotations[@"overlays"]];
            }
        }];
    });
}

RCT_EXPORT_METHOD(setCamera:(nonnull NSNumber *) reactTag
                  cameraOptions:(NSDictionary *)cameraOptions
                  animated:(BOOL)animated)
{
    dispatch_async(self.bridge.uiManager.methodQueue, ^{
        [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
            RCTMapboxGL *mapView = viewRegistry[reactTag];
            if ([mapView isKindOfClass:[RCTMapboxGL class]]) {
                CLLocationDistance altitude = [RCTConvert double:cameraOptions[@"altitude"]];
                CLLocationCoordinate2D centerCoordinate =
                    [RCTConvert CLLocationCoordinate2D:cameraOptions[@"centerCoordinate"]];
                CLLocationDirection heading = [RCTConvert double:cameraOptions[@"heading"]];
                CLLocationDistance pitch = [RCTConvert CGFloat:cameraOptions[@"pitch"]];
                
                MGLMapCamera *camera = [MGLMapCamera cameraLookingAtCenterCoordinate:centerCoordinate
                                                                        fromDistance:altitude
                                                                               pitch:pitch
                                                                             heading:heading];
                
                [mapView setCamera:camera animated:animated];
            }
        }];
    });
}

RCT_EXPORT_METHOD(resetNorth:(nonnull NSNumber *) reactTag)
{
    dispatch_async(self.bridge.uiManager.methodQueue, ^{
        [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
            RCTMapboxGL *mapView = viewRegistry[reactTag];
            if ([mapView isKindOfClass:[RCTMapboxGL class]]) {
                [mapView resetNorth];
            }
        }];
    });
}

RCT_EXPORT_METHOD(resetPosition:(nonnull NSNumber *) reactTag)
{
    dispatch_async(self.bridge.uiManager.methodQueue, ^{
        [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
            RCTMapboxGL *mapView = viewRegistry[reactTag];
            if ([mapView isKindOfClass:[RCTMapboxGL class]]) {
                [mapView resetPosition];
            }
        }];
    });
}


- (NSDictionary *)getAnnotations:(NSArray *)annotationsIds
{
    NSMutableArray* annotations = [@[] mutableCopy];
    NSMutableArray* overlays = [@[] mutableCopy];
    
    for (int i = 0; i < [_annotations count]; i++) {
        RCTMGLAnnotation *annotation = _annotations[i];
        
        if ([annotationsIds containsObject:annotation.id]) {
            [annotations addObject:_annotations[i]];
        }
    }
    
    for (int i = 0; i < [_overlays count]; i++) {
        id<RCTMGLAnnotationProtocol> overlay = (id<RCTMGLAnnotationProtocol>)_overlays[i];
        
        if ([annotationsIds containsObject:overlay.id]) {
            [overlays addObject:_overlays[i]];
        }
    }
    
    return @{
             @"annotations": annotations,
             @"overlays": overlays,
             };
}

- (NSDictionary *)createAnnotations:(NSArray *)annotations
{
    NSMutableArray* annotationsArray = [NSMutableArray array];
    NSMutableArray* overlaysArray = [NSMutableArray array];
    
    NSDictionary *result = @{
                             @"annotations": annotationsArray,
                             @"overlays": overlaysArray,
                             };
    
    if ([annotations count] == 0) {
        return result;
    }
    
    NSDictionary *annotation;
    
    NSEnumerator *enumerator = [annotations objectEnumerator];
    
    while (annotation = [enumerator nextObject]) {
        if ([annotation[@"type"] isEqualToString:@"point"]) {
            [annotationsArray addObject:[[self class] generateAnnotation:annotation]];
        } else {
            [overlaysArray addObject:[[self class] generateAnnotation:annotation]];
        }
    }
    
    [_annotations addObjectsFromArray:annotationsArray];
    [_overlays addObjectsFromArray:overlaysArray];
    
    return result;
}

+ (id)generateAnnotation:(NSDictionary *)annotation
{
    id generatedAnnotation;
    
    NSString *type = [RCTConvert NSString:annotation[@"type"]];
    
    NSString *id = @"";
    
    id = [RCTConvert NSString:annotation[@"id"]];
    
    if ([type isEqualToString:@"point"]) {
        NSString *title = @"";
        NSString *subtitle = @"";
        
        if (annotation[@"title"]) {
            title = [RCTConvert NSString:annotation[@"title"]];
        }
        
        if (annotation[@"subtitle"]) {
            subtitle = [RCTConvert NSString:annotation[@"subtitle"]];
        }
        
        NSDictionary *coordinate = [RCTConvert NSDictionary:annotation[@"coordinate"]];
        
        RCTMGLAnnotation *point = [RCTMGLAnnotation annotationWithLocation:[RCTConvert CLLocationCoordinate2D:coordinate]
                                                                     title:title
                                                                  subtitle:subtitle
                                                                        id:id];
        
        if (annotation[@"image"]) {
            point.image = [RCTConvert NSDictionary:annotation[@"image"]];
        }
        
        if (annotation[@"rightCalloutAccessoryImage"]) {
            point.rightCalloutAccessoryImage = annotation[@"rightCalloutAccessoryImage"];
        }
        
        generatedAnnotation = point;
        
    } else if ([type isEqualToString:@"polyline"] || [type isEqualToString: @"polygon"]) {
        CGFloat strokeAlpha = 1.0;
        if (annotation[@"strokeAlpha"]) {
            strokeAlpha = [RCTConvert CGFloat:annotation[@"strokeAlpha"]];
        }
        
        UIColor *strokeColor = [UIColor blueColor];
        if (annotation[@"strokeColor"]) {
            strokeColor = [RCTConvert UIColor:annotation[@"strokeColor"]];
        }
        
        double strokeWidth = 3;
        if (annotation[@"strokeWidth"]) {
            strokeWidth = [RCTConvert double:annotation[@"strokeWidth"]];
        }
        
        NSArray *coordinates = [RCTConvert NSArray:annotation[@"coordinates"]];
        NSUInteger numberOfPoints = coordinates.count;
        int count = 0;
        
        CLLocationCoordinate2D *coords = malloc(sizeof(CLLocationCoordinate2D) * numberOfPoints);
        
        for (int i = 0; i < [coordinates count]; i++) {
            CLLocationDegrees latitude = [RCTConvert double:coordinates[i][0]];
            CLLocationDegrees longitude = [RCTConvert double:coordinates[i][1]];
            coords[count] = CLLocationCoordinate2DMake(latitude, longitude);
            count++;
        }
        
        if ([type isEqualToString: @"polyline"]) {
            generatedAnnotation = [RCTMGLAnnotationPolyline polylineWithCoordinates:coords
                                                                              count:count
                                                                        strokeAlpha:strokeAlpha
                                                                        strokeColor:strokeColor
                                                                        strokeWidth:strokeWidth
                                                                                 id:id];
            
        } else if ([type isEqualToString: @"polygon"]) {
            CGFloat fillAlpha = 1.0;
            if (annotation [@"fillAlpha"]) {
                fillAlpha = [RCTConvert CGFloat:annotation[@"fillAlpha"]];
            }
            
            UIColor *fillColor = [UIColor blueColor];
            if (annotation[@"fillColor"]) {
                fillColor = [RCTConvert UIColor:annotation[@"fillColor"]];
            }
            
            generatedAnnotation = [RCTMGLAnnotationPolygon polygonAnnotation:coords
                                                                       count:count
                                                                   fillAlpha:fillAlpha
                                                                   fillColor:fillColor
                                                                 strokeColor:strokeColor
                                                                 strokeAlpha:strokeAlpha
                                                                          id:id];
        }
    } else {
        RCTLogError(@"Type point, polyline or polygon is required! Got \"%@\"", type);
    }
    
    return generatedAnnotation;
}

#pragma mark MGLMapView delegate

- (BOOL)mapView:(RCTMapboxGL *)mapView annotationCanShowCallout:(id <MGLAnnotation>)annotation {
    NSString *title = [(RCTMGLAnnotation *) annotation title];
    NSString *subtitle = [(RCTMGLAnnotation *) annotation subtitle];
    
    if ([title length] != 0 || [subtitle length] != 0) {
        return YES;
    } else {
        return NO;
    }
}

- (nullable UIView *)mapView:(MGLMapView *)mapView rightCalloutAccessoryViewForAnnotation:(id<MGLAnnotation>)annotation
{
    if (![annotation isKindOfClass:[RCTMGLAnnotation class]]) {
        return nil;
    }
    
    if (![(RCTMGLAnnotation *)annotation rightCalloutAccessoryImage]) {
        return nil;
    }
    
    NSDictionary *source = [(RCTMGLAnnotation *)annotation rightCalloutAccessoryImage][@"source"];
    
    NSString *uri = source[@"uri"];
    
    UIImage *image = nil;
    
    UIImage *networkImage = [UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:uri]]];
    
    CGFloat width = 10;
    CGFloat height = 10;
    
    if (source[@"width"]) {
        width = [RCTConvert CGFloat:source[@"width"]];
    }
    
    if (source[@"height"]) {
        height = [RCTConvert CGFloat:source[@"height"]];
    }
    
    CGSize imageSize = CGSizeMake(width, height);
    
    UIGraphicsBeginImageContextWithOptions(imageSize, NO, 0.0);
    [networkImage drawInRect:CGRectMake(0, 0, imageSize.width, imageSize.height)];
    image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    UIButton *imageButton = [UIButton buttonWithType:UIButtonTypeCustom];
    imageButton.frame = CGRectMake(0, 0, width, height);
    [imageButton setImage:image forState:UIControlStateNormal];
    
    return imageButton;
}

- (void)mapView:(MGLMapView *)mapView annotation:(id<MGLAnnotation>)annotation calloutAccessoryControlTapped:(UIControl *)control
{
    if (annotation.title && annotation.subtitle) {

        NSString *id = [(RCTMGLAnnotation *) annotation id];

        NSDictionary *event = @{ @"target": mapView.reactTag,
                                 @"annotationId": id
                                 };

        [self.bridge.eventDispatcher sendInputEventWithName:@"onRightAccessoryCalloutTapped" body:event];
    }
}

- (MGLAnnotationImage *)mapView:(MGLMapView *)mapView imageForAnnotation:(id<MGLAnnotation>)annotation
{
    if (![annotation isKindOfClass:[RCTMGLAnnotation class]]) {
        return nil;
    }
    
    if (![(RCTMGLAnnotation *)annotation image]) {
        return nil;
    }
    
    NSDictionary *source = [(RCTMGLAnnotation *)annotation image][@"source"];
    
    NSString *uri = source[@"uri"];
    
    MGLAnnotationImage *annotationImage = [mapView dequeueReusableAnnotationImageWithIdentifier:uri];
    
    UIImage *image = nil;
    
    if (!annotationImage) {
        UIImage *networkImage = [UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:uri]]];
        
        CGFloat width = 10;
        CGFloat height = 10;
        
        if (source[@"width"]) {
            width = [RCTConvert CGFloat:source[@"width"]];
        }
        
        if (source[@"height"]) {
            height = [RCTConvert CGFloat:source[@"height"]];
        }
        
        CGSize imageSize = CGSizeMake(width, height);
        
        UIGraphicsBeginImageContextWithOptions(imageSize, NO, 0.0);
        [networkImage drawInRect:CGRectMake(0, 0, imageSize.width, imageSize.height)];
        image = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
    }
    
    annotationImage = [MGLAnnotationImage annotationImageWithImage:image reuseIdentifier:uri];
    
    return annotationImage;
}

- (void)mapView:(MGLMapView *)mapView didSelectAnnotation:(id<MGLAnnotation>)annotation
{
    NSString *id = @"";
    
    if ([annotation isKindOfClass:[RCTMGLAnnotation class]]) {
        id = [(RCTMGLAnnotation *) annotation id];
    } else if ([annotation isKindOfClass:[MGLUserLocation class]]) {
        id = @"userLocation";
    }
    
    NSDictionary *event = @{ @"target": mapView.reactTag,
                             @"annotationId": id
                             };

    [self.bridge.eventDispatcher sendInputEventWithName:@"onAnnotationSelected" body:event];
}

- (void)mapView:(MGLMapView *)mapView didDeselectAnnotation:(id<MGLAnnotation>)annotation
{
    NSString *id = @"";
    
    if ([annotation isKindOfClass:[RCTMGLAnnotation class]]) {
        id = [(RCTMGLAnnotation *) annotation id];
    } else if ([annotation isKindOfClass:[MGLUserLocation class]]) {
        id = @"userLocation";
    }
    
    NSDictionary *event = @{ @"target": mapView.reactTag,
                             @"annotationId": id
                             };
    
    [self.bridge.eventDispatcher sendInputEventWithName:@"onAnnotationDeselected" body:event];
}

- (void)mapView:(MGLMapView *)mapView didUpdateUserLocation:(MGLUserLocation *)userLocation;
{
    NSDictionary *event = @{ @"target": mapView.reactTag,
                             @"userLocation": @{
                                     @"latitude": @(userLocation.coordinate.latitude),
                                     @"longitude": @(userLocation.coordinate.longitude),
                                     @"headingAccuracy": @(userLocation.heading.headingAccuracy),
                                     @"magneticHeading": @(userLocation.heading.magneticHeading),
                                     @"trueHeading": @(userLocation.heading.trueHeading),
                                     @"isUpdating": [NSNumber numberWithBool:userLocation.isUpdating]} };

    [self.bridge.eventDispatcher sendInputEventWithName:@"onUpdateUserLocation" body:event];
}

- (void)mapView:(MGLMapView *)mapView didFailToLocateUserWithError:(NSError *)error
{
    NSDictionary *event = @{ @"target": mapView.reactTag,
                             @"error": @{
                                     @"code": @(error.code),
                                     @"message": error.description
                                     }
                             };
    
    [self.bridge.eventDispatcher sendInputEventWithName:@"onLocateUserFailed" body:event];
}

- (void)mapView:(RCTMapboxGL *)mapView regionDidChangeAnimated:(BOOL)animated
{

    CLLocationCoordinate2D region = mapView.centerCoordinate;

    NSDictionary *event = @{ @"target": mapView.reactTag,
                             @"region": @{ @"centerCoordinate": @{
                                                @"latitude" : @(region.latitude),
                                                @"longitude": @(region.longitude)
                                                },
                                        @"zoomLevel": [NSNumber numberWithDouble:mapView.zoomLevel]
                                        }
                             };

    [self.bridge.eventDispatcher sendInputEventWithName:@"onRegionChanged" body:event];
}

- (CGFloat)mapView:(MGLMapView *)mapView alphaForShapeAnnotation:(RCTMGLAnnotationPolyline *)shape
{
    if ([shape isKindOfClass:[RCTMGLAnnotationPolyline class]]) {
        return shape.strokeAlpha;
    } else if ([shape isKindOfClass:[RCTMGLAnnotationPolygon class]]) {
        return [(RCTMGLAnnotationPolygon *) shape fillAlpha];
    } else {
        return 1.0;
    }
}

- (UIColor *)mapView:(MGLMapView *)mapView strokeColorForShapeAnnotation:(RCTMGLAnnotationPolyline *)shape
{
    if ([shape isKindOfClass:[RCTMGLAnnotationPolyline class]]) {
        return shape.strokeColor;
    } else if ([shape isKindOfClass:[RCTMGLAnnotationPolygon class]]) {
        return [(RCTMGLAnnotationPolygon *) shape strokeColor];
    } else {
        return [UIColor blueColor];
    }
}

- (CGFloat)mapView:(MGLMapView *)mapView lineWidthForPolylineAnnotation:(RCTMGLAnnotationPolyline *)shape
{
    return shape.strokeWidth;
}

- (UIColor *)mapView:(MGLMapView *)mapView fillColorForPolygonAnnotation:(RCTMGLAnnotationPolygon *)shape
{
    return shape.fillColor;
}

- (void)mapViewDidFinishLoadingMap:(MGLMapView *)mapView
{
    _mapIsLoaded = YES;
}

#pragma mark UITapGestureRecognizer

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer{
    return YES;
}

- (void)handleSingleTap:(UITapGestureRecognizer *)tap
{
    MGLMapView *mapView = (MGLMapView *)tap.view;
   
    
    CLLocationCoordinate2D location = [mapView convertPoint:[tap locationInView:mapView]
                                       toCoordinateFromView:mapView];
    
    NSDictionary *event = @{ @"target": mapView.reactTag,
                             @"coordinate": @{
                                     @"latitude": @(location.latitude),
                                     @"longitude": @(location.longitude),
                                     }
                             };
    
    [self.bridge.eventDispatcher sendInputEventWithName:@"onTap" body:event];
}

@end
