//
//  RCTConvert+MGLMapView.m
//  RCTMapboxGL
//
//  Created by Bobby Sudekum on 4/30/15.
//  Copyright (c) 2015 Mapbox. All rights reserved.
//

#import "RCTConvert+MGLMapView.h"

@implementation RCTConvert(MGLMapView)

RCT_ENUM_CONVERTER(MGLUserTrackingMode, (@{
                                           @"none": @(MGLUserTrackingModeNone),
                                           @"follow": @(MGLUserTrackingModeFollow),
                                           @"followHeading": @(MGLUserTrackingModeFollowWithHeading),
                                           @"followCourse": @(MGLUserTrackingModeFollowWithCourse)
                                           }), MGLUserTrackingModeFollow, integerValue)

@end