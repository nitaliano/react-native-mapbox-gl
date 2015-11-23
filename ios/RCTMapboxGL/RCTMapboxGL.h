//
//  RCTMapboxGL.h
//  RCTMapboxGL
//
//  Created by Bobby Sudekum on 4/30/15.
//  Copyright (c) 2015 Mapbox. All rights reserved.
//

#import "Mapbox.h"
#import "MGLMapView.h"
#import "MGLAccountManager.h"
#import "RCTView.h"

@interface RCTMapboxGL : MGLMapView

- (void)setAccessToken:(NSString *)accessToken;
- (void)setAttributionButtonVisibility:(BOOL)isVisible;

@end