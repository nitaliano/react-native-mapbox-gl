//
//  RCTMapboxGL.m
//  RCTMapboxGL
//
//  Created by Bobby Sudekum on 4/30/15.
//  Copyright (c) 2015 Mapbox. All rights reserved.
//

#import "RCTMapboxGL.h"
#import "RCTBridgeModule.h"
#import "RCTEventDispatcher.h"
#import "UIView+React.h"
#import "RCTLog.h"
#import <objc/runtime.h>

@implementation RCTMapboxGL {
    /* Required to publish events */
    RCTEventDispatcher *_eventDispatcher;
    
    /* Our map subview instance */
    MGLMapView *_map;
    
    /* Map properties */
    NSString *_accessToken;
    NSMutableArray *_annotations;
    NSMutableArray *_newAnnotations;
    CLLocationCoordinate2D _centerCoordinate;
    BOOL _clipsToBounds;
    BOOL _debugActive;
    double _direction;
    BOOL _finishedLoading;
    BOOL _rotateEnabled;
    BOOL _showsUserLocation;
    NSURL *_styleURL;
    double _zoomLevel;
    
    UIButton *_rightCalloutAccessory;
}

RCT_EXPORT_MODULE();

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher
{
    if (self = [super init]) {
        _eventDispatcher = eventDispatcher;
        _clipsToBounds = YES;
        _finishedLoading = NO;
    }
    
    return self;
}

- (void)setAccessToken:(NSString *)accessToken
{
    _accessToken = accessToken;
    [self updateMap];
}

- (void)updateMap
{
    if (_map) {
        _map.centerCoordinate = _centerCoordinate;
        _map.clipsToBounds = _clipsToBounds;
        _map.debugActive = _debugActive;
        _map.direction = _direction;
        _map.rotateEnabled = _rotateEnabled;
        _map.showsUserLocation = _showsUserLocation;
        _map.styleURL = _styleURL;
        _map.zoomLevel = _zoomLevel;
    } else {
        /* We need to have a height/width specified in order to render */
        if (_accessToken && _styleURL && self.bounds.size.height > 0 && self.bounds.size.width > 0) {
            [self createMap];
        }
    }
}

- (void)createMap
{
    _map = [[MGLMapView alloc] initWithFrame:self.bounds styleURL:_styleURL];
    [MGLAccountManager setAccessToken:_accessToken];
    _map.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    _map.delegate = self;
    _map.userTrackingMode = MGLUserTrackingModeFollow;
    [self updateMap];
    [self addSubview:_map];
    [self layoutSubviews];
}


- (void)layoutSubviews
{
    [self updateMap];
    _map.frame = self.bounds;
}

- (void)setAnnotations:(NSMutableArray *)annotations
{
    _newAnnotations = annotations;
    [self performSelector:@selector(updateAnnotations) withObject:nil afterDelay:0.1];
}

- (void)updateAnnotations
{
    if (_newAnnotations) {

        // Take into account any already placed pins
        if (_annotations.count) {
            [_map removeAnnotations:_annotations];
            _annotations = nil;
        }
        
        _annotations = _newAnnotations;
        
        for (int i = 0; i < [_newAnnotations count]; i++) {
            
            NSString *type = [(RCTMGLAnnotation *) _newAnnotations[i] type];
            NSUInteger *count = [(RCTMGLAnnotation *) _newAnnotations[i] count];
            CLLocationCoordinate2D *coords = [(RCTMGLAnnotation *) _newAnnotations[i] coordinates];
            
            if ([type  isEqual: @"point"]) {
                [_map addAnnotation: _newAnnotations[i]];
            } else if ([type  isEqual: @"linestring"]) {
                MGLPolyline *coordShape = [MGLPolyline  polylineWithCoordinates:coords count:count];
                [_map addAnnotation:coordShape];
            } else if ([type  isEqual: @"polygon"]) {
                MGLPolygon *coordShape = [MGLPolygon polygonWithCoordinates:coords count:count];
                [_map addAnnotation:coordShape];
            } else {
                // Point annotations
            }
        }
        
    }
}

- (void)setCenterCoordinate:(CLLocationCoordinate2D)centerCoordinate
{
    _centerCoordinate = centerCoordinate;
    [self updateMap];
}

- (void)setDebugActive:(BOOL)debugActive
{
    _debugActive = debugActive;
    [self updateMap];
}

- (void)setRotateEnabled:(BOOL)rotateEnabled
{
    _rotateEnabled = rotateEnabled;
    [self updateMap];
}

- (void)setShowsUserLocation:(BOOL)showsUserLocation
{
    _showsUserLocation = showsUserLocation;
    [self updateMap];
}

- (void)setClipsToBounds:(BOOL)clipsToBounds
{
    _clipsToBounds = clipsToBounds;
    [self updateMap];
}

- (void)setDirection:(double)direction
{
    _direction = direction;
    [self updateMap];
}

- (void)setZoomLevel:(double)zoomLevel
{
    _zoomLevel = zoomLevel;
    [self updateMap];
}

- (void)setStyleURL:(NSURL*)styleURL
{
    _styleURL = styleURL;
    [self updateMap];
}

- (void)setRightCalloutAccessory:(UIButton *)rightCalloutAccessory
{
    _rightCalloutAccessory = rightCalloutAccessory;
    [self performSelector:@selector(updateAnnotations) withObject:nil afterDelay:0.1];
}

-(void)setDirectionAnimated:(int)heading
{
    [_map setDirection:heading animated:YES];
}

-(void)setZoomLevelAnimated:(double)zoomLevel
{
    [_map setZoomLevel:zoomLevel animated:YES];
}

-(void)setCenterCoordinateAnimated:(CLLocationCoordinate2D)coordinates
{
    [_map setCenterCoordinate:coordinates animated:YES];
}

-(void)setCenterCoordinateZoomLevelAnimated:(CLLocationCoordinate2D)coordinates zoomLevel:(double)zoomLevel
{
    [_map setCenterCoordinate:coordinates zoomLevel:zoomLevel animated:YES];
}

- (CGFloat)mapView:(MGLMapView *)mapView alphaForShapeAnnotation:(RCTMGLAnnotation *)annotation
{
    return 0.9;
}

- (UIColor *)mapView:(MGLMapView *)mapView strokeColorForShapeAnnotation:(RCTMGLAnnotation *)annotation
{
    return [UIColor colorWithRed:233.0f/255.0f green:96.0f/255.0f blue:96.0f/255.0f alpha:1.0];
}

- (UIColor *)mapView:(MGLMapView *)mapView fillColorForPolygonAnnotation:(RCTMGLAnnotation *)annotation
{
    return [UIColor colorWithRed:233.0f/255.0f green:96.0f/255.0f blue:96.0f/255.0f alpha:1.0];
}

- (CGFloat)mapView:(MGLMapView *)mapView lineWidthForPolylineAnnotation:(id<MGLAnnotation>)annotation
{
    return 5;
}

- (void)mapView:(MGLMapView *)mapView didUpdateUserLocation:(MGLUserLocation *)userLocation;
{
    NSDictionary *event = @{ @"target": self.reactTag,
                             @"userLocation": @{ @"latitude": @(userLocation.coordinate.latitude),
                                                 @"longitude": @(userLocation.coordinate.longitude),
                                                 @"headingAccuracy": @(userLocation.heading.headingAccuracy),
                                                 @"magneticHeading": @(userLocation.heading.magneticHeading),
                                                 @"trueHeading": @(userLocation.heading.trueHeading),
                                                 @"isUpdating": [NSNumber numberWithBool:userLocation.isUpdating]} };
    
    [_eventDispatcher sendInputEventWithName:@"topLoadingFinish" body:event];
}


-(void)mapView:(MGLMapView *)mapView didSelectAnnotation:(id<MGLAnnotation>)annotation
{
    
    NSString *type = [(RCTMGLAnnotation *) annotation type];
    if (annotation.title && annotation.subtitle && [type  isEqual: @"point"]) {
        
        NSString *id = [(RCTMGLAnnotation *) annotation id];
        
        NSDictionary *event = @{ @"target": self.reactTag,
                                 @"annotation": @{ @"title": annotation.title,
                                                   @"subtitle": annotation.subtitle,
                                                   @"id": id,
                                                   @"latitude": @(annotation.coordinate.latitude),
                                                   @"longitude": @(annotation.coordinate.longitude)} };
        
        [_eventDispatcher sendInputEventWithName:@"topBlur" body:event];
    }
}


- (void)mapView:(RCTMapboxGL *)mapView regionDidChangeAnimated:(BOOL)animated
{
    
    CLLocationCoordinate2D region = _map.centerCoordinate;
    
    NSDictionary *event = @{ @"target": self.reactTag,
                             @"region": @{ @"latitude": @(region.latitude),
                                           @"longitude": @(region.longitude),
                                           @"zoom": [NSNumber numberWithDouble:_map.zoomLevel] } };
    
    [_eventDispatcher sendInputEventWithName:@"topChange" body:event];
}


- (void)mapView:(RCTMapboxGL *)mapView regionWillChangeAnimated:(BOOL)animated
{
    
    CLLocationCoordinate2D region = _map.centerCoordinate;
    
    NSDictionary *event = @{ @"target": self.reactTag,
                             @"region": @{ @"latitude": @(region.latitude),
                                           @"longitude": @(region.longitude),
                                           @"zoom": [NSNumber numberWithDouble:_map.zoomLevel] } };
    
    [_eventDispatcher sendInputEventWithName:@"topChange" body:event];
}

- (BOOL)mapView:(RCTMapboxGL *)mapView annotationCanShowCallout:(id <MGLAnnotation>)annotation {
    return YES;
}

- (void)selectAnnotationAnimated:(NSUInteger)annotationInArray
{
    if (annotationInArray >= [_annotations count]) {
        RCTLogError(@"Could not find annotation in array");
        return;
    }
    if ([_annotations count] != 0) {
        [_map selectAnnotation:_annotations[annotationInArray] animated:YES];
    }
}

- (void)removeAnnotation:(NSUInteger)annotationInArray
{
    if (annotationInArray >= [_annotations count]) {
        RCTLogError(@"Could not find annotation in array");
        return;
    }
    if ([_annotations count] != 0) {
        [_map removeAnnotation:_annotations[annotationInArray]];
        [_annotations removeObjectAtIndex:annotationInArray];
    }
}

- (UIButton *)mapView:(MGLMapView *)mapView rightCalloutAccessoryViewForAnnotation:(id <MGLAnnotation>)annotation;
{
    if ([annotation isKindOfClass:[RCTMGLAnnotation class]]) {
        UIButton *accessoryButton = [(RCTMGLAnnotation *) annotation rightCalloutAccessory];
        return accessoryButton;
    }
    return nil;
}

- (void)mapView:(MGLMapView *)mapView annotation:(id<MGLAnnotation>)annotation calloutAccessoryControlTapped:(UIControl *)control
{
    if (annotation.title && annotation.subtitle) {

        NSString *id = [(RCTMGLAnnotation *) annotation id];
        
        NSDictionary *event = @{ @"target": self.reactTag,
                                 @"annotation": @{ @"title": annotation.title,
                                                   @"subtitle": annotation.subtitle,
                                                   @"id": id,
                                                   @"latitude": @(annotation.coordinate.latitude),
                                                   @"longitude": @(annotation.coordinate.longitude)} };
        
        [_eventDispatcher sendInputEventWithName:@"topBlur" body:event];
    }
}

@end

/* RCTMGLAnnotation */

@interface RCTMGLAnnotation ()

@property (nonatomic) CLLocationCoordinate2D coordinate;
@property (nonatomic) NSString *title;
@property (nonatomic) NSString *subtitle;

@end

@implementation RCTMGLAnnotation

+ (instancetype)annotationWithLocation:(CLLocationCoordinate2D)coordinate title:(NSString *)title subtitle:(NSString *)subtitle id:(NSString *)id
{
    return [[self alloc] initWithLocation:coordinate title:title subtitle:subtitle id:id];
}

+ (instancetype)annotationWithLocationRightCallout:(CLLocationCoordinate2D)coordinate title:(NSString *)title subtitle:(NSString *)subtitle id:(NSString *)id rightCalloutAccessory:(UIButton *)rightCalloutAccessory
{
    return [[self alloc] initWithLocationRightCallout:coordinate title:title subtitle:subtitle id:id rightCalloutAccessory:rightCalloutAccessory];
}

+ (instancetype)shapeAnnotation:(CLLocationCoordinate2D *)coordinates fillColor:(NSString *)fillColor strokeColor:(NSString *)strokeColor width:(double)width alpha:(double)alpha id:(NSString *)id type:(NSString *)type count:(NSUInteger)count
{
    return [[self alloc] initShapeAnnotation:coordinates fillColor:fillColor strokeColor:strokeColor width:width alpha:alpha id:id type:type count:count];
}


- (instancetype)initWithLocation:(CLLocationCoordinate2D)coordinate title:(NSString *)title subtitle:(NSString *)subtitle id:(NSString *)id
{
    if (self = [super init]) {
        coordinate = coordinate;
        _title = title;
        _subtitle = subtitle;
        _id = id;
    }
    
    return self;
}

- (instancetype)initWithLocationRightCallout:(CLLocationCoordinate2D)coordinate title:(NSString *)title subtitle:(NSString *)subtitle id:(NSString *)id rightCalloutAccessory:(UIButton *)rightCalloutAccessory
{
    if (self = [super init]) {
        _rightCalloutAccessory = rightCalloutAccessory;
        _coordinate = coordinate;
        _title = title;
        _subtitle = subtitle;
        _id = id;
    }
    
    return self;
}

- (instancetype)initShapeAnnotation:(CLLocationCoordinate2D *)coordinates fillColor:(NSString *)fillColor strokeColor:(NSString *)strokeColor width:(double)width alpha:(double)alpha id:(NSString *)id type:(NSString *)type count:(NSUInteger)count
{
    if (self = [super init]) {
        _coordinates = coordinates;
        _fillColor = fillColor;
        _strokeColor = strokeColor;
        _width = width;
        _alpha = alpha;
        _id = id;
        _type = type;
        _count = count;
    }
    
    return self;
}


@end
