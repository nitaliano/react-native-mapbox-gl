//
//  RCTMGLAnnotation.h
//  RCTMapboxGL
//
//  Created by Bobby Sudekum on 4/30/15.
//  Copyright (c) 2015 Mapbox. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MGLAnnotation.h"
#import "RCTMGLAnnotationProtocol.h"

@interface RCTMGLAnnotation : NSObject <MGLAnnotation, RCTMGLAnnotationProtocol>

@property (nonatomic) NSString *id;
@property (nonatomic, strong) NSDictionary *rightCalloutAccessoryImage;
@property (nonatomic) NSDictionary *image;

+ (instancetype)annotationWithLocation:(CLLocationCoordinate2D)coordinate
                                 title:(NSString *)title
                              subtitle:(NSString *)subtitle
                                    id:(NSString *)id;

- (instancetype)initWithLocation:(CLLocationCoordinate2D)coordinate
                           title:(NSString *)title
                        subtitle:(NSString *)subtitle
                              id:(NSString *)id;

@end
