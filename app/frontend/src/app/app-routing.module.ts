import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ClassificationComponent } from './components/classification/classification.component';
import { ActiveLearningComponent } from './components/active-learning/active-learning.component';
import { ModelPerformanceComponent } from './components/model-performance/model-performance.component';
import { SegmentationComponent } from './components/segmentation/segmentation.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'classification', component: ClassificationComponent },
  { path: 'improve-model', component: ActiveLearningComponent },
  { path: 'performance', component: ModelPerformanceComponent },
  { path: 'segmentation', component: SegmentationComponent },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
