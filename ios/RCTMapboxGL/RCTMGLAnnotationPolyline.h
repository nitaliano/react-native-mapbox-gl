//
//  RCTMGLAnnotationPolyline.h
//  RCTMapboxGL
//
//  Created by Bobby Sudekum on 4/30/15.
//  Copyright (c) 2015 Mapbox. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MGLPolyline.h"
#import "RCTMGLAnnotationProtocol.h"

@interface RCTMGLAnnotationPolyline : MGLPolyline <RCTMGLAnnotationProtocol>

@property (nonatomic) NSString *id;
@property (nonatomic) double strokeAlpha;
@property (nonatomic) UIColor *strokeColor;
@property (nonatomic) double strokeWidth;
@property (nonatomic) NSString *type;
@property (nonatomic) NSUInteger count;
@property (nonatomic) CLLocationCoordinate2D *coordinates;

+ (instancetype)polylineWithCoordinates:(CLLocationCoordinate2D *)coordinates
                                            count:(NSUInteger)count
                                      strokeAlpha:(double)strokeAlpha
                                      strokeColor:(UIColor *)strokeColor
                                      strokeWidth:(double)strokeWidth
                                               id:(NSString *)id;

@end
