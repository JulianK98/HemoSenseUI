import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LinkBoxComponent } from './components/main-page/link-box/link-box.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ClassificationComponent } from './components/classification/classification.component';
import { ActiveLearningComponent } from './components/active-learning/active-learning.component';
import { ModelPerformanceComponent } from './components/model-performance/model-performance.component';
import { AboutComponent } from './components/about/about.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { AlConfigComponent } from './components/active-learning/al-config/al-config.component';
import { AlClassifyComponent } from './components/active-learning/al-classify/al-classify.component';
import { SubmitComponent } from './components/active-learning/submit/submit.component';
import { AlPerformanceComponent } from './components/active-learning/al-performance/al-performance.component';

// Angular Material imports
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ListSelectionComponent } from './components/classification/list-selection/list-selection.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HttpClientModule } from '@angular/common/http';
import { ImageViewerComponent } from './components/classification/image-viewer/image-viewer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

// Plotly
import { CommonModule } from '@angular/common';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { SegmentationComponent } from './components/segmentation/segmentation.component';
PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LinkBoxComponent,
    MainPageComponent,
    ClassificationComponent,
    ActiveLearningComponent,
    ModelPerformanceComponent,
    AboutComponent,
    SideNavComponent,
    ListSelectionComponent,
    ImageViewerComponent,
    AlConfigComponent,
    AlClassifyComponent,
    SubmitComponent,
    AlPerformanceComponent,
    SegmentationComponent,
    ImageViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    PlotlyModule,
    MatStepperModule,
    MatSliderModule,
    MatButtonModule,
    MatSelectModule,
    MatGridListModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
