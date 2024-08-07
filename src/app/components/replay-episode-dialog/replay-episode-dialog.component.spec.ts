import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplayEpisodeDialogComponent } from './replay-episode-dialog.component';

describe('ReplayEpisodeDialogComponent', () => {
  let component: ReplayEpisodeDialogComponent;
  let fixture: ComponentFixture<ReplayEpisodeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReplayEpisodeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplayEpisodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
