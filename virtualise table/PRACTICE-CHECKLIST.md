# Virtualised Table Practice Checklist

## Round system
- Round 1: follow the docs closely
- Round 2: rebuild with fewer hints
- Round 3: rebuild from memory

## Dataset
- [ ] make row type
- [ ] write row generator
- [ ] render small plain table

## Visible range math
- [ ] compute start index
- [ ] compute visible count
- [ ] compute end index
- [ ] add overscan
- [ ] clamp to bounds

## Rendering
- [ ] add fixed-height scroll container
- [ ] render visible slice only
- [ ] preserve full scroll illusion
- [ ] verify DOM node count stays low

## Confidence checks
- [ ] I can explain viewport vs total list
- [ ] I can explain overscan
- [ ] I can rebuild the scroll math from memory
