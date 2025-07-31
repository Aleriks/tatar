import { makeAutoObservable } from 'mobx';

class MainPageStore {
    currentSlide = 0;
    slidePlaying = false
    direction = 1
    checkScroll = true;
    isFirstVisit = true;

    setFirstVisitComplete() {
        this.isFirstVisit = false;
    }

    constructor() {
        makeAutoObservable(this);
    }

    nextSlide() {
        if (this.slidePlaying) return
        this.currentSlide = this.currentSlide + 1
        this.direction = 1
    }

    prevSlide() {
        if (this.slidePlaying) return
        if (this.currentSlide === 0) return
        this.currentSlide = this.currentSlide - 1
        this.direction = -1
    }

    end() {
        console.log('END');

        this.currentSlide = -1;
    }
}

export const mainPageStore = new MainPageStore();