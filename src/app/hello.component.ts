import { Component } from '@angular/core';

import { WebService } from './web.service';

@Component({
  selector: 'hello',
  templateUrl: './hello.component.html'
})
export class HelloComponent {
  state = 0; // 0 - begin, 1 - show form, 2 - wait for video, 3 - show video, 4 - error
  parameters = [];
  results = [];
  video_url = '';

  constructor(private webService: WebService) {
    // Get data from storyboard
    this.webService.getMessage('/storyboards/31193').subscribe(
      resp => {
        this.parameters = resp.data;
        this.parameters.forEach((parameter, i) => {
          this.results.push({ key: parameter.key, val: parameter.val });
        });
        this.state = 1;
      },
      Error => {
        this.state = 4;
      }
    );
  }

  getVideo() {
    // check all fields not empty
    for (var i = 0; i < this.results.length; i++)
      if (this.results[i].val.trim().length === 0) {
        alert('All fields should be non empty');
        return;
      }

    //wait for video
    this.state = 2;

    let data = {
      storyboard_id: 31193,
      output: {
        video: [
          {
            video_type: 'mp4',
            quality: 26,
            height: 1280,
            crop_to_ratio: [16, 9]
          }
        ]
      },
      data: this.results
    };

    //send form
    this.webService.postMessage('/storyboards/generate', data).subscribe(
      resp => {
        this.video_url = resp.output.video[0].links.url;
        let check_status_url = resp.output.video[0].links.check_status_url;
        let self = this;
        this.state = 2;

        //check when video is ready
        var id = setInterval(checkVideo, 500);
        function checkVideo() {
          self.webService.checkVideo(check_status_url).subscribe(resp => {
            if (resp.status == 'VIDEO_AVAILABLE') {
              clearInterval(id);
              self.addScript();
              self.state = 3;
            } else if (resp.status == 'ERROR' || resp.status == 'NOT_EXIST') {
              clearInterval(id);
              self.state = 4;
            }
          });
        }
      },
      Error => {
        this.state = 4;
      }
    );
  }

  addScript() {
    var player = document.createElement('div');
    player.id = 'idm_player';
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.innerHTML =
      ` var player_options = {
         interactive: true,
         src: "` +
      this.video_url +
      `",
         size: "hd",
         autoplay: true
       };
       idmPlayerCreate(player_options, "idm_player");`;

    document.getElementById('player_script').append(player, s);
  }
}
