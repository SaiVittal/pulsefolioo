using AutoMapper;

namespace Pulsefolio.UnitTests;

public static class AutoMapperTestHelper
{
    private static IMapper? _mapper;

    public static IMapper CreateMapper()
    {
        if (_mapper != null) return _mapper;

        var config = new MapperConfiguration(cfg =>
        {
            // Scan Application assembly for profiles
            cfg.AddMaps("Pulsefolio.Application");
        });

        _mapper = config.CreateMapper();
        return _mapper;
    }
}
