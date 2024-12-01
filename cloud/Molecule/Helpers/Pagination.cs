

namespace Molecule.Helpers;

public class MPagination
{
    public long Total = 0;
    public int Next = 0,
            Prev = 0,
            Offset = 0,
            Limit = 20,
            Page = 1,
            Size = 20,
            Pages = 1;
    public bool HasNext = false,
            HasPrev = false;

    public static Tuple<int, int> CalcOffset(int page, int size)
    {
        if (size > 256) size = 256;
        var offset = (page - 1) * size;
        if (offset < 0) offset = 0;
        return new Tuple<int, int>(offset, size);
    }

    public static MPagination Calc(int page, int size)
    {
        var (offset, limit) = CalcOffset(page, size);

        return new MPagination
        {
            Total = 0,
            Page = 1,
            Size = 10,
            Pages = 1,
            HasNext = false,
            HasPrev = false,
            Next = 1,
            Prev = 1,
            Offset = offset,
            Limit = limit
        };
    }
}