import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import omit from 'lodash/omit';
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { ListChildComponentProps, VariableSizeList } from 'react-window';

const ITEM_HEIGHT = 400; // px
const ITEM_SIZE = 50; // px
const LISTBOX_PADDING = 8; // px

function Row(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  const optionProps = dataSet[0];
  const option = dataSet[1];

  return (
    <Typography
      component="li"
      key={optionProps.key}
      {...omit(optionProps, 'key')}
      noWrap
      style={{ ...inlineStyle, paddingLeft: 24 }}
    >
      <Stack>
        <Typography 
          variant="body1" 
          noWrap
          sx={{
            '@media (max-width:495px)': {
              fontSize: '0.875rem', 
            }
          }}
        >
          {option.title}
        </Typography>
      </Stack>
    </Typography>
  );
}

const OuterElementContext = createContext({});

const OuterElementType = forwardRef<HTMLDivElement>(
  function OuterElementType(props, ref) {
    const outerProps = useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
  }
);

function useResetCache(data: unknown) {
  const ref = useRef<VariableSizeList>(null);
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
export const ListboxComponent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;

  const itemData: React.ReactElement[] = useMemo(() => {
    return (children as React.ReactElement[]).reduce(
      (acc, item: React.ReactElement & { children?: React.ReactElement[] }) => {
        acc.push(item);
        for (const child of item.children || []) {
          acc.push(child);
        }
        return acc;
      },
      [] as React.ReactElement[]
    );
  }, [children]);

  const itemCount = itemData.length;
  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={ITEM_HEIGHT + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={() => ITEM_SIZE}
          overscanCount={5}
          itemCount={itemCount}
        >
          {(props) => <Row {...props} />}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});
